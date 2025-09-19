'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import * as TablerIcons from '@tabler/icons-react';
import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  GridCol,
  Select,
  Stack,
  Text,
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

const formatValue = (key: string, value: any) => {
  switch (key) {
    case 'ABN':
      return value >= 1
        ? `ABN registered for ${value} or more year${value > 1 ? 's': ''}`
        : `ABN registered for 1 day or more`;
    case 'GST':
      return value >= 1
        ? `GST registered for ${value} or more years`
        : `GST registered for 1 day or more`;
    case 'Property':
      return value ? 'Own a home in your or your spouse\'s name' : 'Not a property owner';
    case 'Misc':
      return Array.isArray(value) ? value : [value];
    default:
      return value;
  }
};

const formatValueShort = (key: string, value: any) => {
  switch (key) {
    case 'ABN':
      return value >= 1
        ? `ABN registered for ${value} years`
        : `ABN registered for 1 day`;
    case 'GST':
      return value >= 1
        ? `GST registered for ${value} years`
        : `GST registered for 1 day or more`;
    case 'Property':
      return value ? 'Property owner' : 'Not property owner';
    case 'Misc':
      return Array.isArray(value) ? value : [value];
    default:
      return value;
  }
};

const ItemLayout = ({ title, categories, rate, index, image }: ItemLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const Icon = (TablerIcons as any)[image] || TablerIcons.IconCircle;

  return (
    <Card
      shadow="sm"
      radius="lg"
      p={{ base: 'md', md: 'lg' }}
      withBorder
      onClick={() => router.push(`${pathname}/${index}`)}
      style={{ cursor: 'pointer', transition: 'all 200ms ease' }}
      sx={(theme) => ({
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.shadows.lg,
        },
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#fff',
      })}
    >
      <Grid gutter="md" align="center">
        <GridCol span={{ base: 12, md: 2 }}>
          <Flex justify="center" align="center">
            <Icon size={48} color="#01E194" stroke={1.5} />
          </Flex>
        </GridCol>

        <GridCol span={{ base: 12, md: 10 }}>
          <Stack>
            <Title order={4} style={{ wordBreak: 'break-word' }}>
              {title}
            </Title>
            <Divider />
            <Flex gap="xs" wrap="wrap">
              {categories.map((category, idx) => (
                <Badge
                  key={idx}
                  color="teal"
                  variant="light"
                  size="md"
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  {category}
                </Badge>
              ))}
            </Flex>
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
};

export default function ListView() {
  const itemList = useCriteria();

  const [filters, setFilters] = useState({
    minRate: 0,
    maxRate: 20,
    maxPrice: 1000000,
    search: '',
    gst: '',
    home: '',
    abn: '',
  });

  if (!itemList) return null;

  // Parse categories into dropdown options (store raw values)
  const categoryOptions = useMemo(() => {
    const gstSet = new Set<number>();
    const homeSet = new Set<boolean>();
    const abnSet = new Set<number>();

    Object.values(itemList).forEach((item) => {
      gstSet.add(item.Text.GST);
      homeSet.add(item.Text.Property);
      abnSet.add(item.Text.ABN);
    });

    return {
      gst: Array.from(gstSet).sort((a, b) => a - b).map((val) => ({
        value: val.toString(),
        label: formatValueShort('GST', val),
      })),
      home: Array.from(homeSet).map((val) => ({
        value: val ? 'Yes' : 'No',
        label: formatValueShort('Property', val),
      })),
      abn: Array.from(abnSet).sort((a, b) => a - b).map((val) => ({
        value: val.toString(),
        label: formatValueShort('ABN', val),
      })),
    };
  }, [itemList]);

  const filteredItems = Object.entries(itemList).filter(([key, item]) => {
    const rateOk = item.Rate >= filters.minRate && item.Rate <= filters.maxRate;
    const priceOk = item.MaxPrice <= filters.maxPrice;
    const searchOk = item.Title.toLowerCase().includes(filters.search.toLowerCase());

    const gstOk = !filters.gst || item.Text.GST >= parseInt(filters.gst);
    const homeOk =
      !filters.home || (filters.home === 'Yes' ? item.Text.Property : !item.Text.Property);
    const abnOk = !filters.abn || item.Text.ABN >= parseInt(filters.abn);

    return rateOk && priceOk && searchOk && gstOk && homeOk && abnOk;
  });

  return (
    <Container>
      <Stack mb="md">
        <Flex gap="md" wrap="wrap" mt="sm" align="center" justify="center">
          <Select
            label="ABN Running"
            placeholder="Select ABN..."
            data={categoryOptions.abn}
            value={filters.abn}
            onChange={(value) => setFilters({ ...filters, abn: value ?? '' })}
          />
          <Select
            label="GST Registration"
            placeholder="Select GST..."
            data={categoryOptions.gst}
            value={filters.gst}
            onChange={(value) => setFilters({ ...filters, gst: value ?? '' })}
          />
          <Select
            label="Home Ownership"
            placeholder="Select home status..."
            data={categoryOptions.home}
            value={filters.home}
            onChange={(value) => setFilters({ ...filters, home: value ?? '' })}
          />
        </Flex>

        <Button
          mt="sm"
          onClick={() =>
            setFilters({
              minRate: 0,
              maxRate: 20,
              maxPrice: 1000000,
              search: '',
              gst: '',
              home: '',
              abn: '',
            })
          }
        >
          Reset Filters
        </Button>
      </Stack>

      <Stack p="xs">
        {filteredItems.length > 0 ? (
          filteredItems.map(([key, item]) => {
            const categories = [
              formatValue('ABN', item.Text.ABN),
              formatValue('GST', item.Text.GST),
              formatValue('Property', item.Text.Property),
              ...item.Text.Misc,
            ];

            return (
              <ItemLayout
                key={key}
                index={key}
                title={item.Title}
                categories={categories}
                rate={item.Rate}
                image={item.Icon}
              />
            );
          })
        ) : (
          <Text>No items match the selected filters</Text>
        )}
      </Stack>
    </Container>
  );
}
