'use client';

import { useContext, useEffect, useRef } from 'react';
import { ATO_OptionsContext } from '../Context';

export default function FetchATOInterest() {
  const ctx = useContext(ATO_OptionsContext);
  const interestBase = 7;

  const interestFetched = useRef(false);

  useEffect(() => {
    if (interestFetched.current) {
      return;
    }
    //To stop spamming ATO == Remove in Live
    ctx?.setATO_InterestRate(10.78);
    interestFetched.current = true;
    return;

    
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://onlineservices.ato.gov.au/cdn/static-data/codes-tables/TC9FIGURE.json'
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const json = await res.json();

        const interestCol = json.columns.findIndex((i: any) => i.name === 'AM_FIGURE');
        const interestTypeCol = json.columns.findIndex((i: any) => i.name === 'IN_TYPE_FIGURE');

        if (interestCol === -1) {
          throw new Error('AM_FIGURE column not found');
        }
        if (interestTypeCol === -1) {
          throw new Error('IN_TYPE_FIGURE column not found');
        }
        if (!json.rows || json.rows.length === 0) {
          throw new Error('No rows found in data');
        }

        // Find the last row with IN_TYPE_FIGURE === 'T'
        const rowToUse = [...json.rows].reverse().find((row: any) => row[interestTypeCol] === 'T');

        if (!rowToUse) {
          throw new Error('No row found with IN_TYPE_FIGURE === "T"');
        }

        const rate = interestBase + Number(rowToUse[interestCol]);
        console.log(rate);
        ctx?.setATO_InterestRate(Number(rate.toFixed(2)));
        interestFetched.current = true;
        if (ctx) {
          console.log('ctx exists and Interest rate set in context:', rate.toFixed(2));
        }
      } catch (err: any) {
        console.error('Failed to fetch ATO interest data:', err.message);
      }
    };

    fetchData();
  });

  return null; // Nothing to render
}
