'use client';

import { useContext } from 'react';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { Grid, GridCol, Group, Image, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { useCriteria } from '../CriteriaHandler';

interface CriteriaProps {
  criteriaList?: string[];
  index?: number;
}

export default function CriteriaDisplay({ criteriaList = [], index = 0 }: CriteriaProps) {
  const criteria = useCriteria();

  console.log('criteriaMap = ', criteria[0]);

  return (
    <Grid w='100%'>
      {criteria[index].Text.map((text) => (
        <GridCol span={6} key={text}>
          <Group >
            <ThemeIcon size="lg" radius="xl" color="teal">
              <IconRosetteDiscountCheckFilled size={18} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              {text}
            </Text>
          </Group>
        </GridCol>
      ))}
    </Grid>
  );
}
