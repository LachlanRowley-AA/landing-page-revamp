'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import * as TablerIcons from '@tabler/icons-react';
import { IconChevronRight, IconFilter, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import { useCriteria } from '../CriteriaHandler';

interface ItemLayoutProps {
  title: string;
  categories: string[];
  rate: number;
  index: string;
  image: string;
  backgroundColor?: string;
}

const formatValue = (key: string, value: any) => {
  switch (key) {
    case 'ABN':
      return value >= 1
        ? `ABN registered for ${value} or more years`
        : `ABN registered for 1 day or more`;
    case 'GST':
      return value >= 1
        ? `GST registered for ${value} or more years`
        : value > 0
        ? `GST registered for 1 day or more`
        : 'Not GST registered';
    case 'Property':
      return value ? "Own a home in your or your spouse's name" : 'Not a property owner';
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
        ? `ABN registered for ${value} year${value > 1 ? 's' : ''}`
        : `ABN registered for 1 day`;
    case 'GST':
      return value >= 1
        ? `GST registered for ${value} years`
        : value > 0
        ? `GST registered for 1 day or more`
        : 'Not GST registered';
    case 'Property':
      return value ? 'Property owner' : 'Not property owner';
    case 'Misc':
      return Array.isArray(value) ? value : [value];
    default:
      return value;
  }
};

const lightenColor = (color: string, amount: number) => {
  // Helper: returns a lighter version of a hex color
  const clamp = (val: number) => Math.min(255, Math.max(0, val));
  const num = parseInt(color.replace('#', ''), 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00ff) + amount);
  const b = clamp((num & 0x0000ff) + amount);
  return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
};

const ItemLayout = ({ title, categories, rate, index, image, backgroundColor }: ItemLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const Icon = (TablerIcons as any)[image] || TablerIcons.IconCircle;
  const [isHovered, setIsHovered] = useState(false);

  const hoverColor = backgroundColor ? lightenColor(backgroundColor, 10) : '#f9f9f9';

  return (
    <Card
      shadow={isHovered ? 'lg' : 'sm'}
      radius="lg"
      p="lg"
      withBorder
      onClick={() => router.push(`${pathname}/${index}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        borderColor: isHovered ? '#01E194' : undefined,
        backgroundColor: isHovered ? hoverColor : backgroundColor || '#fff',
      }}
    >
      <Grid gutter="lg" align="center">
        <GridCol span={{ base: 12, sm: 2 }}>
          <Flex
            justify="center"
            align="center"
            style={{
              background:
                'linear-gradient(135deg, rgba(1, 225, 148, 0.1) 0%, rgba(1, 225, 148, 0.05) 100%)',
              borderRadius: '16px',
              padding: '16px',
              transition: 'transform 300ms ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <Icon size={32} color="#01E194" stroke={1.5} />
          </Flex>
        </GridCol>

        <GridCol span={{ base: 12, sm: 9 }}>
          <Stack gap="sm">
            <Flex gap="xs" wrap="wrap">
              {categories.map((category, idx) => (
                <Badge
                  key={idx}
                  color="rgba(255, 255, 255, 1)"
                  variant="light"
                  size="lg"
                  radius="xl"
                  style={{
                    overflow: 'visible',
                    textOverflow: 'unset',
                    whiteSpace: 'normal',
                    border: '1.5px solid rgba(1, 225, 148, 0.3)',
                    fontWeight: 500,
                  }}
                  h="auto"
                  px="md"
                  py="xs"
                  bg='rgba(255, 255, 255, 1)'
                  styles={{
                    label: {
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      textOverflow: 'unset',
                      textAlign: 'center',
                      color: '#2d2d2d',
                    },
                  }}
                >
                  {category}
                </Badge>
              ))}
            </Flex>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, sm: 1 }}>
          <Flex justify="center" align="center">
            <ActionIcon
              variant="subtle"
              color="teal"
              size="lg"
              radius="xl"
              style={{
                transition: 'transform 300ms ease',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
              }}
            >
              <Container visibleFrom="md">
                <IconChevronRight size={24} />
              </Container>
            </ActionIcon>
          </Flex>
        </GridCol>
      </Grid>
    </Card>
  );
};

export default function ListView() {
  const itemList = useCriteria();
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    minRate: 0,
    maxRate: 20,
    maxPrice: 1000000,
    search: '',
    gst: '',
    home: '',
    abn: '',
  });

  if (!itemList) {
    return null;
  }

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
      gst: Array.from(gstSet)
        .sort((a, b) => a - b)
        .map((val) => ({
          value: val.toString(),
          label: formatValueShort('GST', val),
        })),
      home: Array.from(homeSet).map((val) => ({
        value: val ? 'Yes' : 'No',
        label: formatValueShort('Property', val),
      })),
      abn: Array.from(abnSet)
        .sort((a, b) => a - b)
        .map((val) => ({
          value: val.toString(),
          label: formatValueShort('ABN', val),
        })),
    };
  }, [itemList]);

  const filteredItems = Object.entries(itemList)
    .filter(([key, item]) => {
      const rateOk = item.Rate >= filters.minRate && item.Rate <= filters.maxRate;
      const priceOk = item.MaxPrice <= filters.maxPrice;
      const searchOk = item.Title.toLowerCase().includes(filters.search.toLowerCase());
      const gstOk = !filters.gst || item.Text.GST <= parseInt(filters.gst);
      const homeOk = !filters.home || (filters.home === 'No' ? !item.Text.Property : true);
      const abnOk = !filters.abn || item.Text.ABN <= parseInt(filters.abn);
      return rateOk && priceOk && searchOk && gstOk && homeOk && abnOk;
    })
    .sort((a, b) => a[1].Rate - b[1].Rate);

  const hasActiveFilters = filters.gst || filters.home || filters.abn;

  const clearFilters = () => {
    setFilters({
      minRate: 0,
      maxRate: 20,
      maxPrice: 1000000,
      search: '',
      gst: '',
      home: '',
      abn: '',
    });
  };

  // Alternating background colors
  const colors = ['#FFFFFF', '#E5F3FD']; //'#fcfcf3'

  return (
    <Container size="xl" py="xs">
      <Stack gap="xs" w="100%">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} mb="xs">
              Available Options
            </Title>
            <Text c="dimmed" size="lg">
              {filteredItems.length} {filteredItems.length === 1 ? 'option' : 'options'} available
            </Text>
          </div>

          <Button
            leftSection={<IconFilter size={18} />}
            variant={showFilters ? 'filled' : 'light'}
            color="teal"
            size="md"
            onClick={() => setShowFilters(!showFilters)}
            visibleFrom="md"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </Group>

        {/* Filters Panel */}
        <Transition mounted={showFilters} transition="slide-down" duration={300}>
          {(styles) => (
            <Paper shadow="sm" p="md" radius="lg" withBorder style={styles}>
              <Stack gap="xs">
                <Group justify="space-between" align="center" gap="xs">
                  <Title order={3}>Filter Options</Title>
                  {hasActiveFilters && (
                    <Button
                      variant="subtle"
                      color="gray"
                      size="sm"
                      leftSection={<IconX size={16} />}
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </Group>

                <Grid gutter="lg">
                  <GridCol span={{ base: 12, sm: 4 }}>
                    <Select
                      label="ABN Running"
                      placeholder="Select ABN requirement..."
                      data={categoryOptions.abn}
                      value={filters.abn}
                      onChange={(value) => setFilters({ ...filters, abn: value ?? '' })}
                      clearable
                      size="md"
                    />
                  </GridCol>
                  <GridCol span={{ base: 12, sm: 4 }}>
                    <Select
                      label="GST Registration"
                      placeholder="Select GST requirement..."
                      data={categoryOptions.gst}
                      value={filters.gst}
                      onChange={(value) => setFilters({ ...filters, gst: value ?? '' })}
                      clearable
                      size="md"
                    />
                  </GridCol>
                  <GridCol span={{ base: 12, sm: 4 }}>
                    <Select
                      label="Home Ownership"
                      placeholder="Select home status..."
                      data={categoryOptions.home}
                      value={filters.home}
                      onChange={(value) => setFilters({ ...filters, home: value ?? '' })}
                      clearable
                      size="md"
                    />
                  </GridCol>
                </Grid>
              </Stack>
            </Paper>
          )}
        </Transition>

        {/* Results List */}
        <Stack gap="md">
          {filteredItems.length > 0 ? (
            filteredItems.map(([key, item], idx) => {
              const categories = [
                formatValue('ABN', item.Text.ABN),
                formatValue('GST', item.Text.GST),
                formatValue('Property', item.Text.Property),
                ...item.Text.Misc,
              ];
              const backgroundColor = colors[idx % colors.length];

              return (
                <ItemLayout
                  key={key}
                  index={key}
                  title={item.Title}
                  categories={categories}
                  rate={item.Rate}
                  image={item.Icon}
                  backgroundColor={backgroundColor}
                />
              );
            })
          ) : (
            <Paper p="xl" radius="lg" withBorder>
              <Stack align="center" gap="md" py="xl">
                <IconFilter size={48} color="gray" opacity={0.3} />
                <Title order={3} c="dimmed">
                  No items match your filters
                </Title>
                <Text c="dimmed" ta="center">
                  Try adjusting your filter criteria to see more results
                </Text>
                {hasActiveFilters && (
                  <Button variant="light" color="teal" onClick={clearFilters} mt="md">
                    Clear all filters
                  </Button>
                )}
              </Stack>
            </Paper>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
