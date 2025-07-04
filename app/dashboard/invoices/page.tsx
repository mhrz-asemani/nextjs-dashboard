/**
 * The client-side Search, updates URL search params.
 * Next.js re-renders Page(only logics) then receives the updated search params as props.
 * Then fetches the searchParams to get the query and page number.
 * The server-side Table component fetches the invoices based on the query and page number.
 * 
 * Data Flow:
 *  User types → "Search" updates URL → Next.js re-renders page → 
    New searchParams prop → "Table" refetches filtered data
 */

import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchInvoicesPages } from "@/app/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  // we set default values for query and page if fetching is failed.
  const { query = "", page = "1" } = (await searchParams) || {};
  const currentPage = Math.max(1, parseInt(page as string)) || 1;
  const totalPages = await fetchInvoicesPages(query);
  // const query = searchParams?.query || "";
  // const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
