import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { API_CONFIG } from '@/config/api';

// Initialize Google GenAI client (server-side only)
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Google GenAI API key is not configured. Please set GOOGLE_GENAI_API_KEY or NEXT_PUBLIC_GOOGLE_GENAI_API_KEY environment variable.');
  }
  return new GoogleGenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, conversationHistory } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Please provide a valid input string.' },
        { status: 400 }
      );
    }

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .map((msg: { role: string; content: string }) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        )
        .join('\n\n');
      conversationContext += '\n\n';
    }
    conversationContext += `User: ${input.trim()}`;

    // Initialize Google GenAI client
    const client = getGenAIClient();

    // Create interaction with Google GenAI
    const interaction = await client.interactions.create({
      model: API_CONFIG.GOOGLE_GENAI.model,
      input: conversationContext,
    });

    // Check interaction status
    if (interaction.status === 'failed') {
      return NextResponse.json(
        { error: 'Interaction failed. Please try again.' },
        { status: 500 }
      );
    }

    // Extract text from outputs
    let responseText = 'No response received.';
    if (interaction.outputs && interaction.outputs.length > 0) {
      // Find the last text content in outputs
      for (let i = interaction.outputs.length - 1; i >= 0; i--) {
        const output = interaction.outputs[i];
        // Check if it's a TextContent type
        if (output && 'type' in output && output.type === 'text' && 'text' in output) {
          responseText = output.text || responseText;
          break;
        }
      }
    }

    // If interaction is still in progress, wait a bit and check again
    if (interaction.status === 'in_progress' && interaction.id) {
      // Poll for completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const updatedInteraction = await client.interactions.get(interaction.id);
        if (updatedInteraction.outputs && updatedInteraction.outputs.length > 0) {
          for (let i = updatedInteraction.outputs.length - 1; i >= 0; i--) {
            const output = updatedInteraction.outputs[i];
            if (output && 'type' in output && output.type === 'text' && 'text' in output) {
              responseText = output.text || responseText;
              break;
            }
          }
        }
      } catch (pollError) {
        console.warn('Error polling interaction:', pollError);
      }
    }

    return NextResponse.json({
      success: true,
      text: responseText,
      interactionId: interaction.id,
      status: interaction.status,
    });

  } catch (error) {
    console.error('Error in chat API route:', error);
    
    let errorMessage = 'An error occurred while processing your request.';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('API key')) {
        errorMessage = 'API key is missing or invalid. Please configure GOOGLE_GENAI_API_KEY.';
      } else if (error.message.includes('Connection') || error.message.includes('network')) {
        errorMessage = 'Connection error. Please check your internet connection.';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

