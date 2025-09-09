import { Stack } from '@mantine/core';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';


export default function ContactSpecialist() {
    return (
        <InlineWidget url='https://calendly.com/d/cmh8-ynr-gby/meet-with-asset-alley' styles={{height: '400px'}}/>
    )
}
