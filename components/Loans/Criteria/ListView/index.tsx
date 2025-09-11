'use client';

import { usePathname, useRouter } from 'next/navigation';
import * as TablerIcons from '@tabler/icons-react';
import {
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useCriteria } from '../CriteriaHandler';

interface ItemLayoutProps {
  title: string;
  categories: string[];
  rate: number;
  index: string;
  image: string;
}

const ItemLayout = ({ title, categories, rate, index, image }: ItemLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();


  const Icon = (TablerIcons as any)[image] || 'a';
  console.log(Icon);
  console.log('image=', image)
  return (
    <Card
      shadow="sm"
      radius="lg"
      p="lg"
      withBorder
      onClick={() => router.push(`${pathname}/${index}`)}
      style={{
        cursor: 'pointer',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
      }}
      bg="white"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <Grid>
        <GridCol span={{base: 0, md:2}}>
          <Icon style={{height: '100%', width: '50%', align: 'center', justifyContent: 'center'}} color='#01E194' stroke={1}/>
        </GridCol>
        <GridCol span={{base: 12, md:10}}>
          <Stack gap="sm">
            <Title order={4}>{title}</Title>
            <Divider />
            <Grid>
              {categories.map((category, idx) => (
                <GridCol span={4} key={idx}>
                  <Flex gap="xs" align="c" wrap="wrap">
                    <ThemeIcon size="xs" radius="xl" color="teal">
                      <TablerIcons.IconRosetteDiscountCheckFilled size={12} />
                    </ThemeIcon>
                    <Text
                      size="sm"
                      fw={500}
                      style={{
                        flex: 1,
                        whiteSpace: 'wrap',
                        overflowWrap: 'break-word',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {category}
                    </Text>
                  </Flex>
                </GridCol>
              ))}
            </Grid>
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
};

export default function ListView() {
  const itemList = useCriteria();

  if (!itemList) {
    return null;
  }

  return (
    <Stack gap="lg" bg="white" p="xs">
      {Object.entries(itemList).map(([key, item]) => (
        <ItemLayout
          key={key}
          index={key}
          title={item.Title}
          categories={item.Text}
          rate={item.Rate}
          image={item.Icon}
        />
      ))}
    </Stack>
  );
}
