import { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'daterangepicker';
import 'daterangepicker/daterangepicker.css';
import { Button } from "@/components/ui/button";

interface DateRangePickerProps {
    onDateRangeChange: (data: any[]) => void; // Adjust to your data type
}

const DateRangePicker = ({ onDateRangeChange }: DateRangePickerProps) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        $(buttonRef.current).daterangepicker({
            opens: 'left',
            locale: {
                format: 'MM/DD/YYYY',
            },
        }, async function(start, end) {
            const formattedStartDate = start.format('YYYY-MM-DD HH:mm:ss.SSS');
            const formattedEndDate = end.format('YYYY-MM-DD HH:mm:ss.SSS');

            const apiUrl = `https://localhost:7232/api/Transactions/date-range?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                onDateRangeChange(data); // Call the prop function to notify the parent
            } catch (error) {
                console.error('Failed to fetch:', error);
            }
        });
    }, [onDateRangeChange]);

    return (
        <Button ref={buttonRef} variant="contained">
            Select Date Range
        </Button>
    );
};

export default DateRangePicker;
