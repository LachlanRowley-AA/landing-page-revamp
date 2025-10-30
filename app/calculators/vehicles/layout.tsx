import { CriteriaHandler } from '@/components/Loans/Criteria/CriteriaHandler';
import { DisplayContextProvider } from '@/components/Loans/DisplayContext';
import Navbar from '@/components/Loans/Navbar';
import { Box } from '@mantine/core';

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DisplayContextProvider>
      <CriteriaHandler>
        <Navbar />
        <Box bg="#8d8d8dff" py="xl" mih="100vh" px={0}>
          {children}
        </Box>
      </CriteriaHandler>
    </DisplayContextProvider>
  );
}
