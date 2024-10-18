import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, Form, redirect } from "react-router-dom";

export default function CreateData() {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("businesses");

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="w-full flex justify-center mb-5">
      <Form method="post" className="w-full max-w-sm space-y-4">
        <Select name="category" value={selectedOption} onValueChange={setSelectedOption}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="businesses">Businesses</SelectItem>
            <SelectItem value="reviews">Reviews</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2 justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            type="button"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            name="count"
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-20 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            type="button"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button type="submit" className="w-full">
          Generate {quantity} {selectedOption}
        </Button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const postData = Object.fromEntries(formData); 
  console.log('Submitting data:', postData);
  await fetch("http://localhost:8000/generate-data/", {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return redirect("/");
}
