import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';


const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
)

export async function POST(request: NextRequest) {
    
    try {
        const body = await request.json()
        
        const { name, email, price, businessName, phoneNumber, referrer } = body
        
        const { data, error } = await supabase
            .from('cobrand_enquiries')
            .insert([
                {
                    name,
                    email,
                    price,
                    business_name: businessName,
                    created_at: new Date().toISOString(),
                    phone_number: phoneNumber,
                    referrer
                }
            ])
        
        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }
        
        return NextResponse.json({ success: true, data })
        
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to submit form' },
            { status: 500 }
        )
    }
}