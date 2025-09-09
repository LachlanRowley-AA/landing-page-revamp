import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { Stack } from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';

export default function ContactSpecialist() {
  return (
    <div>
      <JumboTitle
        order={1}
        fz="xs"
        ta="center"
        style={{ textWrap: 'balance' }}
        c={{ base: 'black', md: 'black' }}
        fw={600}
      >Talk to a Specialist</JumboTitle>
      <InlineWidget
        url="https://calendly.com/d/cmh8-ynr-gby/meet-with-asset-alley"
        styles={{ height: '500px' }}
        pageSettings={{
          hideEventTypeDetails: true,
          hideLandingPageDetails: true,
        }}
      />
    </div>
  );
}
