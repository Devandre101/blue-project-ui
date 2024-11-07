import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import $ from 'jquery';
import 'daterangepicker';
import 'daterangepicker/daterangepicker.css';
import { Button } from "@/components/ui/button";

interface DateRangePickerProps {
    onDateRangeChange: (data: any[], dateRange: string) => void; // Pass single dateRange string
}

const DateRangePicker = ({ onDateRangeChange }: DateRangePickerProps) => {
    const buttonRef = useRef(null);
    const [selectedDateRange, setSelectedDateRange] = useState<string>('Select Date Range');

    useEffect(() => {
        $(buttonRef.current).daterangepicker({
            opens: 'left',
            locale: {
                format: 'MM/DD/YYYY',
            },
        }, async function(start, end) {
            const formattedStartDate = start.format('YYYY-MM-DD HH:mm:ss.SSS');
            const formattedEndDate = end.format('YYYY-MM-DD HH:mm:ss.SSS');

            // Concatenate start and end dates into a single string
            const dateRange = `${formattedStartDate} to ${formattedEndDate}`;
            setSelectedDateRange(`${start.format('MM/DD/YYYY')} - ${end.format('MM/DD/YYYY')}`);

            const apiUrl = `https://localhost:7232/api/Transactions/date-range?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

            try {
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsImV4cCI6MTczMTAwNDI0MiwiaXNzIjoiWW91cklzc3VlciIsImF1ZCI6IllvdXJBdWRpZW5jZSJ9.1hS7_wBQWZjAn8dbTo0LX3fwSgaNtC0ed5cWepXo1OQ'; // Replace with your actual token
                const response = await fetch(apiUrl, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });

                if (!response.ok) {
                    toast.error("No dates found in date range. Please try again.");
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                onDateRangeChange(data, dateRange); // Pass data with the dateRange string
            } catch (error) {
                console.error('Failed to fetch:', error);
            }
        });
    }, [onDateRangeChange]);

    return (
        <Button ref={buttonRef} variant="contained">
            {selectedDateRange}
        </Button>
    );
};

export default DateRangePicker;
