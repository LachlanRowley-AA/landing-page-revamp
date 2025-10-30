import Loans from '@/components/Loans';
import { CalculatorContextProvider } from '@/components/Loans/Context';

export default async function Page({ params }: { params: Promise<{ index: number }> }) {
  const { index } = await params;

  return (
    <CalculatorContextProvider>
      <Loans calculatorIndex={index} />
    </CalculatorContextProvider>
  );
}
