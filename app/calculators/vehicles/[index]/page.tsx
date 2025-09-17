import Loans from '@/components/Loans';
import { CalculatorContextProvider } from '@/components/Loans/Context';
import { DisplayContextProvider } from '@/components/Loans/DisplayContext';

export default async function Page(props: { params: Promise<{ index: number }> }) {
  const params = await props.params;
  return (
    <DisplayContextProvider>
      <CalculatorContextProvider>
        <Loans calculatorIndex={params.index} />
      </CalculatorContextProvider>
    </DisplayContextProvider>
  );
}
