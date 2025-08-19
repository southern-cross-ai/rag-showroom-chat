import { createConversation, getUserConversations } from '@/utils/chat-store';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const conversations = await getUserConversations();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const conversationId = await createConversation(title);
    return NextResponse.json({ id: conversationId });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
