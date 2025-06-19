import {
    IconCurrencyDollar,
    IconFileOff,
    IconCalendarTime,
    IconBuilding,
    IconClockBolt,
    IconTrendingUp,
} from '@tabler/icons-react';

import { ReactNode } from 'react';

export type Feature = {
    icon: ReactNode,
    title: string,
    description: ReactNode
}

export type AudienceKey = 'fitout' | 'design' | 'supplier';

type AudienceContent = {
    features: Feature[];
}

export const audienceContent = {
    design: {
        features: [
        {
            icon: <IconCurrencyDollar size={28} stroke={1.5} />,
            title: 'Finance up to $300k',
            description: 'Access unsecured funding of up to $300,000 to fuel your business growth',
        },
        {
            icon: <IconFileOff size={28} stroke={1.5} />,
            title: 'No Financials Needed',
            description: 'Get approved without tax returns or financial statements',
        },
        {
            icon: <IconCalendarTime size={28} stroke={1.5} />,
            title: 'Flexible Terms',
            description: '5-year loan terms with the option for early payoff',
        },
        {
            icon: <IconBuilding size={28} stroke={1.5} />,
            title: 'Use for Branding & Design',
            description: `Works with all websites and branding requirements — no restrictions. 
    Only pay on what you use, you have the choice to fund 25%, 50%, or even 100% of your project`,
        },
        {
            icon: <IconClockBolt size={28} stroke={1.5} />,
            title: 'Fast & Simple',
            description: 'Fully online application with 2–3 day turnaround',
        },
        {
            icon: <IconTrendingUp size={28} stroke={1.5} />,
            title: 'Preserve Cashflow',
            description: 'Build your desired brand without the cashflow constraint',
        },
        ],
    },
    fitout: {
        features: [
            {
                icon: <IconCurrencyDollar size={28} stroke={1.5} />,
                title: 'Finance up to $300k',
                description: 'Access unsecured funding of up to $300,000 to fuel your business growth',
            },
            {
                icon: <IconFileOff size={28} stroke={1.5} />,
                title: 'No Financials Needed',
                description: 'Get approved without tax returns or financial statements',
            },
            {
                icon: <IconCalendarTime size={28} stroke={1.5} />,
                title: 'Flexible Terms',
                description: '5-year loan terms with the option for early payoff',
            },
            {
                icon: <IconBuilding size={28} stroke={1.5} />,
                title: 'Use for Fitouts',
                description: 'Works with all fitouts — no restrictions',
            },
            {
                icon: <IconClockBolt size={28} stroke={1.5} />,
                title: 'Fast & Simple',
                description: 'Fully online application with 2–3 day turnaround',
            },
            {
                icon: <IconTrendingUp size={28} stroke={1.5} />,
                title: 'Preserve Cashflow',
                description: 'Get your desired fitout without the cashflow constraint',
            },

        ],
    },
    supplier: {
        features: [
        {
            icon: <IconCurrencyDollar size={28} stroke={1.5} />,
            title: 'Finance up to $300k',
            description: 'Access unsecured funding of up to $300,000 to fuel your business growth.',
        },
        {
            icon: <IconFileOff size={28} stroke={1.5} />,
            title: 'No Financials Needed',
            description: 'Get approved without tax returns or financial statements.',
        },
        {
            icon: <IconCalendarTime size={28} stroke={1.5} />,
            title: 'Flexible Terms',
            description: '5-year loan terms with the option for early payoff.',
        },
        {
            icon: <IconBuilding size={28} stroke={1.5} />,
            title: 'Use for Materials',
            description: 'Works with all building material purchases — no restrictions.',
        },
        {
            icon: <IconClockBolt size={28} stroke={1.5} />,
            title: 'Fast & Simple',
            description: 'Fully online application with 2–3 day turnaround.',
        },
        {
            icon: <IconTrendingUp size={28} stroke={1.5} />,
            title: 'Scale Confidently',
            description: 'Take on bigger projects without large upfront costs.',
        },
        ],
    }
} as const satisfies Record<AudienceKey, AudienceContent>;