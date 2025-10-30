'use client';

import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import {
  Group,
  Text,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useCriteria } from '../CriteriaHandler';

interface CriteriaProps {
  criteriaList?: string[];
  index?: number;
}

interface Property {
  ABN: number;
  GST: number;
  Property: boolean;
  [key: string]: any;
}

export default function CriteriaDisplay({ criteriaList = [], index = 0 }: CriteriaProps) {
  const criteria = useCriteria();
  const isMobile = useMediaQuery('(max-width: 768px)'); 

  const currentCriteria = criteria[index];

  // Guard against missing criteria (still loading or invalid index)
  if (!currentCriteria) {
    return <Text>Loading criteria...</Text>; // or a spinner
  }

  const vals: Property = currentCriteria.Text as Property;

  const formatValue = (key: string, value: any) => {
    switch (key) {
      case 'ABN':
        return value >= 1
          ? `ABN registered for ${value} or more years`
          : `ABN registered for 1 day or more`;
      case 'GST':
        return value >= 1
          ? `GST registered for ${value} or more years`
          : `GST registered for 1 day or more`;
      case 'Property':
        return value ? 'Property owner' : 'Not a property owner';
      case 'Misc':
        return Array.isArray(value) ? value : [value];
      default:
        return value;
    }
  };

  const entries = Object.entries(vals);

  return (
    <SimpleGrid
      cols={{ base: 2, md: 3 }}
      spacing="md"
      w="100%"
      style={{ alignItems: 'flex-start' }}
    >
      {entries.map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((v, arrIdx) => (
            <Group align="center" gap="xs" wrap="nowrap" key={`${key}-${arrIdx}`}>
              <ThemeIcon
                size={isMobile ? 'sm' : 'lg'}
                radius="xl"
                color="teal"
                mt={2}
              >
                <IconRosetteDiscountCheckFilled size={isMobile ? 14 : 18} />
              </ThemeIcon>
              <Text
                fz={{ base: 'xs', md: 'md' }}
                fw={500}
                style={{ wordBreak: 'break-word' }}
              >
                {formatValue(key, v)}
              </Text>
            </Group>
          ));
        }

        return (
          <Group align="center" gap="xs" wrap="nowrap" key={key}>
            <ThemeIcon
              size={isMobile ? 'sm' : 'lg'}
              radius="xl"
              color="teal"
              mt={2}
            >
              <IconRosetteDiscountCheckFilled size={isMobile ? 14 : 18} />
            </ThemeIcon>
            <Text
              fz={{ base: 'xs', md: 'md' }}
              fw={500}
              style={{ wordBreak: 'break-word' }}
            >
              {formatValue(key, value)}
            </Text>
          </Group>
        );
      })}
    </SimpleGrid>
  );
}

