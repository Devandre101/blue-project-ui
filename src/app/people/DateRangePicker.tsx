import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import $ from 'jquery';
import 'daterangepicker';
import 'daterangepicker/daterangepicker.css';
import { Button } from "@/components/ui/button";

interface DateRangePickerProps {
    onDateRangeChange: (data: any[], startDate: string, endDate: string) => void; // Pass startDate and endDate
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

            setSelectedDateRange(`${start.format('MM/DD/YYYY')} - ${end.format('MM/DD/YYYY')}`);

            const apiUrl = `https://localhost:7232/api/Transactions/date-range?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    toast.error("No dates found in date range. Please try again.");
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                onDateRangeChange(data, formattedStartDate, formattedEndDate); // Pass dates along with data
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
