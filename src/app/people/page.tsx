"use client"; // Add this line to mark the component as a Client Component

import React, { useEffect, useState } from "react";
import PeopleDataTable from "./data-table"; // Adjust if necessary
import { columns } from "./columns";
import DateRangePicker from "@/app/people/DateRangePicker";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners"; // Import the spinner component

interface Transaction {
  id: number; // Adjust this type based on your API response
  first_name: string; // Adjust based on your API response
  last_name: string;  // Adjust based on your API response
  transactionType: string; // Add this based on your API response
  // Add other properties as needed
}

const People = () => {
  const [people, setPeople] = useState<Transaction[]>([]); // State to hold the fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const fetchPeople = async () => {
    try {
      const response = await fetch("https://localhost:7232/api/Transactions");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPeople(data); // Set the fetched data to state
    } catch (err) {
      setError(err.message); // Set error message if fetch fails
    } finally {
      setLoading(false); // Set loading to false after the fetch is complete
    }
  };

  const fetchPeopleByType = async (type: string) => {
    try {
      const response = await fetch(`https://localhost:7232/api/Transactions/type/${type}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPeople(data); // Set the filtered data to state
    } catch (err) {
      setError(err.message); // Handle error if fetch fails
    }
  };

  useEffect(() => {
    fetchPeople(); // Fetch initial data
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="pulse-spinner"></div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>; // Show error message

  return (
    <div className="container py-10 mx-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <PeopleDataTable columns={columns(fetchPeopleByType)} data={people} />
    </div>
  );
};

export default People;
