import { Center, Container } from '@mantine/core';
import { Cashflow } from '@/components/ATO';

// import TestCORS from '@/components/ATO/FetchData';

export default function ATO_PAGE() {
  return (
    <div style={{backgroundColor:'#ebebeb', width: '100%', height: '100vh'}}>
      <Center>
        {/* <Options /> */}
        <Cashflow />
      </Center>
    </div>
  );
}
