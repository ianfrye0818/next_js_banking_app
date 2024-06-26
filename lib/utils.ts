/* eslint-disable no-prototype-builtins */
import { getLoggedInUser } from '@/app/(auth)/_authActions/user.actions';
import { getAccount, getAccounts, getBanks } from '@/app/(root)/_actions/bank.actions';
import { ROWS_PER_PAGE } from '@/constants';
import { type ClassValue, clsx } from 'clsx';
import { redirect } from 'next/navigation';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    year: 'numeric', // numeric year (e.g., '2023')
    month: '2-digit', // abbreviated month name (e.g., 'Oct')
    day: '2-digit', // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions);

  const formattedDateDay: string = new Date(dateString).toLocaleString('en-US', dateDayOptions);

  const formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions);

  const formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions);

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, '');
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
  resetPage?: boolean;
}

export function formUrlQuery({ params, key, value, resetPage = true }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  if (resetPage) {
    currentUrl.page = '1';
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getPaginatedTransactionsAndTotalPages({
  page,
  transactions,
}: {
  page: string | string[] | undefined | number;
  transactions: Transaction[];
}) {
  let currentPage = Number(page) || 1;
  const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  const lastIndex = currentPage * ROWS_PER_PAGE;
  const firstIndex = lastIndex - ROWS_PER_PAGE;
  const currentTransactions = transactions.slice(firstIndex, lastIndex);

  return { totalPages, currentTransactions, currentPage };
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case 'depository':
      return {
        bg: 'bg-blue-25',
        lightBg: 'bg-blue-100',
        title: 'text-blue-900',
        subText: 'text-blue-700',
      };

    case 'credit':
      return {
        bg: 'bg-success-25',
        lightBg: 'bg-success-100',
        title: 'text-success-900',
        subText: 'text-success-700',
      };

    default:
      return {
        bg: 'bg-green-25',
        lightBg: 'bg-green-100',
        title: 'text-green-900',
        subText: 'text-green-700',
      };
  }
}

export function countTransactionCategories(transactions: Transaction[]): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map((category) => ({
    name: category,
    count: categoryCounts[category],
    totalCount,
  }));

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split('/');

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (pending: boolean) => {
  // const today = new Date();
  // const twoDaysAgo = new Date(today);
  // twoDaysAgo.setDate(today.getDate() - 2);

  return pending ? 'Processing' : 'Success';
};

export const formatTitleCase = (string: string) => {
  return string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function formatTransactionObject(transaction: Transaction) {
  return {
    ...transaction,
    status: getTransactionStatus(transaction.pending),
    amount: formatAmount(transaction.amount),
    date: formatDateTime(new Date(transaction.date)),
    paymentChannel: formatTitleCase(transaction.paymentChannel),
    category: formatTitleCase(transaction.category),
    name: removeSpecialCharacters(transaction.name),
  };
}
