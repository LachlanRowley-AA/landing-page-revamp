'use client';

import { IconEdit, IconFlask } from '@tabler/icons-react';
import { Badge, Button, Group, List, ScrollArea, Table, Text } from '@mantine/core';
import { FormatValue } from '@/lib/calculatorMethods';

interface Props {
  data: Record<string, any>;
  onEdit: (item: any) => void;
  onTest: (item: any) => void;
}

export default function LenderDashboard({ data, onEdit, onTest }: Props) {
  const sortedEntries = Object.entries(data).sort(([, a], [, b]) =>
    (a.title || '').toLowerCase().localeCompare((b.title || '').toLowerCase())
  );

  const rows = sortedEntries.map(([key, item], index) => {
    const {
      title,
      rate,
      max_price,
      max_balloon,
      min_deposit,
      abn,
      gst,
      property,
      finance_fee,
      private_sale_fee,
      private_sale_uplift,
      balloon_calc_method,
      brokerage_calc_method,
      misc,
    } = item;

    const isEven = index % 2 === 0;
    const rowBg = isEven ? '#f8f9fa' : '#ffffff';
    const privateSaleBg = isEven ? '#fff3e0' : '#ffe0b2';
    const characteristicBg = isEven ? '#e0ffe0' : '#c4ffb2';

    return (
      <tr key={key} style={{ backgroundColor: rowBg }}>
        <td style={{ padding: '12px 16px' }}>
          <Text fw={600} size="sm">
            {title}
          </Text>
        </td>
        <td style={{ padding: '12px 16px', backgroundColor: characteristicBg }}>
          <Text size="sm">{FormatValue('ABN', abn)}</Text>
        </td>
        <td style={{ padding: '12px 16px', backgroundColor: characteristicBg }}>
          <Text size="sm">{FormatValue('GST', gst)}</Text>
        </td>
        <td style={{ padding: '12px 16px', backgroundColor: characteristicBg }}>
          {property ? 'Yes' : 'No'}
        </td>
        <td style={{ padding: '12px 16px' }}>{rate}%</td>
        <td style={{ padding: '12px 16px' }}>
          <Text size="sm">${max_price?.toLocaleString()}</Text>
        </td>
        <td style={{ padding: '12px 16px' }}>
          <Text size="sm">{min_deposit}%</Text>
        </td>
        <td style={{ padding: '12px 16px' }}>
          <Text size="sm">{max_balloon}%</Text>
        </td>
        <td style={{ padding: '12px 16px' }}>
          <Text size="sm">${finance_fee}</Text>
        </td>
        <td style={{ padding: '12px 16px', backgroundColor: privateSaleBg }}>
          <Text size="sm" fw={500}>
            ${private_sale_fee}
          </Text>
        </td>
        <td style={{ padding: '12px 16px', backgroundColor: privateSaleBg }}>
          <Text size="sm" fw={500}>
            {private_sale_uplift}%
          </Text>
        </td>
        <td style={{ padding: '12px 16px', minWidth: '200px' }}>
          {item?.misc?.length > 0 ? (
            <List spacing="xs" size="sm">
              {item.misc.map((cond: string, i: number) => (
                <List.Item key={i}>
                  <Text size="sm">{cond}</Text>
                </List.Item>
              ))}
            </List>
          ) : (
            <Text c="dimmed" size="sm">
              —
            </Text>
          )}
        </td>
        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
          <Group gap="xs" justify="flex-end">
            <Button
              variant="light"
              size="sm"
              leftSection={<IconEdit size={16} />}
              onClick={() => onEdit({ id: key, ...item })}
            >
              Edit
            </Button>
          </Group>
        </td>
        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
          <Group gap="xs" justify="flex-end">
            <Button
              variant="filled"
              size="sm"
              leftSection={<IconFlask size={16} />}
              onClick={() => onTest({ id: key, ...item })}
            >
              Test
            </Button>
          </Group>
        </td>
        <td style={{ padding: '12px 16px', backgroundColor: privateSaleBg }}>
          <Text size="sm" fw={500}>
            {balloon_calc_method}
          </Text>
        </td>
      </tr>
    );
  });

  return (
    <ScrollArea>
      <Table highlightOnHover withTableBorder withColumnBorders style={{ minWidth: '100%' }}>
        <thead style={{ backgroundColor: '#2c3e50' }}>
          <tr>
            <th style={{ padding: '12px 16px', color: '#ffffff', fontWeight: 600 }}>Title</th>
            <th
              style={{
                padding: '12px 16px',
                color: '#ffffff',
                backgroundColor: '#1be600ff',
                fontWeight: 600,
              }}
            >
              ABN
            </th>
            <th
              style={{
                padding: '12px 16px',
                color: '#ffffff',
                backgroundColor: '#1be600ff',
                fontWeight: 600,
              }}
            >
              GST
            </th>
            <th
              style={{
                padding: '12px 16px',
                color: '#ffffff',
                backgroundColor: '#1be600ff',
                fontWeight: 600,
              }}
            >
              Property Backed
            </th>

            <th style={{ padding: '12px 16px', color: '#ffffff', fontWeight: 600 }}>Rate</th>
            <th style={{ padding: '12px 16px', color: '#ffffff', fontWeight: 600 }}>Max Price</th>
            <th style={{ padding: '12px 16px', color: '#ffffff', fontWeight: 600 }}>Min Deposit</th>
            <th style={{ padding: '12px 16px', color: '#ffffff', fontWeight: 600 }}>Max Balloon</th>
            <th style={{ padding: '12px 16px', color: '#ffffff', fontWeight: 600 }}>Finance Fee</th>
            <th
              style={{
                padding: '12px 16px',
                color: '#fff3e0',
                backgroundColor: '#e65100',
                fontWeight: 600,
              }}
            >
              Private Sale Fee
            </th>
            <th
              style={{
                padding: '12px 16px',
                color: '#fff3e0',
                backgroundColor: '#e65100',
                fontWeight: 600,
              }}
            >
              Private Sale Uplift
            </th>
            <th style={{ padding: '12px 16px', color: '#ffffff', fontWeight: 600 }}>
              Misc Conditions
            </th>
            <th
              style={{
                padding: '12px 16px',
                color: '#ffffff',
                fontWeight: 600,
                textAlign: 'right',
              }}
            >
              Actions
            </th>
            <th
              style={{
                padding: '12px 16px',
                color: '#ffffff',
                fontWeight: 600,
                textAlign: 'right',
              }}
            />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
