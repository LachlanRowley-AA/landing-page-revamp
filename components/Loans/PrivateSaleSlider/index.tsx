import { useContext } from 'react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Group, Slider, Text } from '@mantine/core';
import { CalculatorContext } from '../Context';
import { Criteria, useCriteria } from '../Criteria/CriteriaHandler';

// function  setLoan_InterestRate(
//     isPrivateSale ? calculator.Rate + calculator.PrivateSaleUplift : calculator.Rate
//   );

interface PrivateSaleSliderProps {
    index: number;
}
export default function PrivateSaleSlider({index} : PrivateSaleSliderProps) {
  const ctx = useContext(CalculatorContext);
  const criteria = useCriteria();
  if (!criteria) {
    return;
  }
  if (!ctx) {
    return;
  }
  const { setLoanInterestRate, isPrivateSale, setIsPrivateSale } = ctx;
  const calculator = criteria[index];


  function toggleIsPrivateSale(value: boolean) {
    setIsPrivateSale(value);
    setLoanInterestRate(value ? calculator.Rate + calculator.PrivateSaleUplift : calculator.Rate);
  }

  return (
    <Group justify="center">
      <Text fz={{ base: 'sm', md: 'md' }}>Dealership</Text>
      <Slider
        value={isPrivateSale ? 100 : 0}
        onChange={(val: number) => toggleIsPrivateSale(val >= 50)}
        min={0}
        max={100}
        step={100}
        size="xl"
        w={120}
        label={null}
        // onClick={(e) =>{ setPrivateChecked(!privateChecked); e.stopPropagation();}}
        styles={{
          track: {
            backgroundColor: isPrivateSale ? 'lightgreen' : 'lightblue',
            borderRadius: '999px',
            height: '32px',
          },
          thumb: {
            height: '32px',
            width: '32px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: '2px solid gray',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
        thumbChildren={
          isPrivateSale ? (
            <IconArrowRight size={20} color="green" />
          ) : (
            <IconArrowLeft size={20} color="green" />
          )
        }
      />

      <Text fz={{ base: 'sm', md: 'md' }}>Private Sale</Text>
    </Group>
  );
}
