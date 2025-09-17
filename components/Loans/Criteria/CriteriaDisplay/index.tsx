'use client';

import { useContext } from 'react';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { Grid, GridCol, Group, Image, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useCriteria } from '../CriteriaHandler';

interface CriteriaProps {
  criteriaList?: string[];
  index?: number;
}

export default function CriteriaDisplay({ criteriaList = [], index = 0 }: CriteriaProps) {
  const criteria = useCriteria();
  const isMobile = useMediaQuery('(max-width: 768px)'); // adjust breakpoint

  return (
    <Grid w="100%">
      {criteria[index].Text.map((text) => (
        <GridCol span={6} key={text}>
          <Group align="flex-start" gap="xs" wrap="nowrap">
            <ThemeIcon
              size={isMobile ? 'sm' : 'lg'}
              radius="xl"
              color="teal"
              mt={2} // tiny offset to vertically align with text
            >
              <IconRosetteDiscountCheckFilled size={isMobile ? 14 : 18} />
            </ThemeIcon>
            <Text fz={{ base: 'xs', md: 'sm' }} fw={500} style={{ wordBreak: 'break-word' }}>
              {text}
            </Text>
          </Group>
        </GridCol>
      ))}
    </Grid>
  );
}
