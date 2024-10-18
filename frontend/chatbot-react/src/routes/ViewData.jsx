import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ButtonLink = ({ to, children, ...props }) => {
  return (
    <Button asChild {...props}>
      <Link to={to}>{children}</Link>
    </Button>
  );
};

// let businesses = [
//   { name: "Business 1", category: "Category 1", location: "Location 1" },
//   { name: "Business 2", category: "Category 2", location: "Location 2" },
//   { name: "Business 3", category: "Category 3", location: "Location 3" },
//   { name: "Business 4", category: "Category 4", location: "Location 4" },
//   { name: "Business 5", category: "Category 5", location: "Location 5" },
//   { name: "Business 6", category: "Category 6", location: "Location 6" },
//   { name: "Business 7", category: "Category 7", location: "Location 7" },
//   { name: "Business 8", category: "Category 8", location: "Location 8" },
//   { name: "Business 9", category: "Category 9", location: "Location 9" },
//   { name: "Business 10", category: "Category 10", location: "Location 10" },
// ];

// let reviews = [
//   { name: "Business 1", rating: 4, review: "Good food and service" },
//   { name: "Business 2", rating: 3, review: "Average food and service" },
//   { name: "Business 3", rating: 5, review: "Excellent food and service" },
//   { name: "Business 4", rating: 2, review: "Poor food and service" },
//   { name: "Business 5", rating: 4, review: "Good food and service" },
//   { name: "Business 6", rating: 3, review: "Average food and service" },
//   { name: "Business 7", rating: 5, review: "Excellent food and service" },
//   { name: "Business 8", rating: 2, review: "Poor food and service" },
//   { name: "Business 9", rating: 4, review: "Good food and service" },
//   { name: "Business 10", rating: 3, review: "Average food and service" },
// ];

const columns = {
  businesses: {
    Name: "business_name",
    Category: "business_category",
    Location: "business_city",
  },
  reviews: {
    Name: "business_name",
    Rating: "rating",
    Review: "review_text",
  },
};

export default function ViewData() {
  const entryData = useLoaderData();
  const { businesses, reviews } = entryData;
  const [selectedData, setSelectedData] = React.useState("businesses");
  const data = selectedData === "businesses" ? businesses : reviews;
  console.log(data);
  return (
    <>
      <Card>
        <div className="m-4 w-[200px]">
          <Select value={selectedData} onValueChange={setSelectedData}>
            <SelectTrigger>
              <SelectValue placeholder="select data" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Data</SelectLabel>
                <SelectItem value="businesses">Businesses</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableCaption>List of Data Entries</TableCaption>
          <TableHeader>
            <TableRow>
              {Object.keys(columns[selectedData]).map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry, index) => (
              <TableRow
                key={
                  selectedData === "businesses"
                    ? entry["business_id"]
                    : entry["review_id"]
                }
              >
                {Object.entries(columns[selectedData]).map(([key, value]) => {
                  return <TableCell key={key}>{entry[value]}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <ButtonLink to="/create-data" className="my-5">
        Generate New Data
      </ButtonLink>
    </>
  );
}

export async function loader() {
  const response_businesses = await fetch("http://localhost:8000/businesses/");
  const response_reviews = await fetch("http://localhost:8000/reviews/");
  console.log(response_businesses);
  const data_businesses = await response_businesses.json();
  const data_reviews = await response_reviews.json();
  console.log(data_businesses);
  return { businesses: data_businesses, reviews: data_reviews };
}
