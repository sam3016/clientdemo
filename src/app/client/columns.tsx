"use client";

import { ColumnDef } from "@tanstack/react-table"
import { fuzzySort } from "./data-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Clients = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  country: string;
  city: string;
}

export const columns: ColumnDef<Clients>[] = [
  {
    accessorKey: "id",
    header: "ID",
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
  {
    accessorKey: "last_name",
    header: "LastName",
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
  {
    accessorKey: "email",
    header: "Email",
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
  {
    accessorKey: "country",
    header: "Country",
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
  {
    accessorKey: "city",
    header: "City",
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
]
