'use client';

import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { Grid, GridCol, Group, Text, ThemeIcon } from '@mantine/core';
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
}

export default function CriteriaDisplay({ criteriaList = [], index = 0 }: CriteriaProps) {
  const criteria = useCriteria();
  const isMobile = useMediaQuery('(max-width: 768px)'); // adjust breakpoint
  const vals: Property = criteria[index].Text as Property;

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
  console.log("raw value = ", vals);
  const entries = Object.entries(vals);

  return (
    <Grid w="100%">
      {entries.map(([key, value], idx) => {
        // Handle arrays separately
        if (Array.isArray(value)) {
          return value.map((v, arrIdx) => (
            <GridCol span={6} key={`${key}-${arrIdx}`}>
              <Group align="center" gap="xs" wrap="nowrap">
                <ThemeIcon size={isMobile ? 'sm' : 'lg'} radius="xl" color="teal" mt={2}>
                  <IconRosetteDiscountCheckFilled size={isMobile ? 14 : 18} />
                </ThemeIcon>
                <Text fz={{ base: 'xs', md: 'md' }} fw={500} style={{ wordBreak: 'break-word' }}>
                  {v.toString()}
                </Text>
              </Group>
            </GridCol>
          ));
        }

        // Render primitive values
        return (
          <GridCol span={6} key={key}>
            <Group align="center" gap="xs" wrap="nowrap">
              <ThemeIcon size={isMobile ? 'sm' : 'lg'} radius="xl" color="teal" mt={2}>
                <IconRosetteDiscountCheckFilled size={isMobile ? 14 : 18} />
              </ThemeIcon>
              <Text fz={{ base: 'xs', md: 'md' }} fw={500} style={{ wordBreak: 'break-word' }}>
                {formatValue(key, value)}
              </Text>
            </Group>
          </GridCol>
        );
      })}
    </Grid>
  );
}
