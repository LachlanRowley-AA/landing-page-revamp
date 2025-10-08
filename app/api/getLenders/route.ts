import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';


const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
)

export async function GET() {
    
    try {        
        const { data, error } = await supabase
            .from('lenders')
            .select('*')
        
        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }
        
        return NextResponse.json({ data, status: 200 })
        
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to submit form' },
            { status: 500 }
        )
    }
}