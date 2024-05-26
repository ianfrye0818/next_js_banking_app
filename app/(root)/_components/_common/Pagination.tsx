'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils';

export default function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleNavigation(type: 'prev' | 'next') {
    const pageNumber = type === 'prev' ? Number(page) - 1 : Number(page) + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      value: pageNumber.toString(),
      key: 'page',
    });
    router.push(newUrl, { scroll: false });
  }

  return (
    <div className='flex justify-between gap-3'>
      <Button
        size='lg'
        variant='ghost'
        className='p-0 hover:bg-transparent'
        onClick={() => handleNavigation('prev')}
        disabled={Number(page) <= 1}
      >
        <Image
          src='/icons/arrow-left.svg'
          alt='arrow'
          width={20}
          height={20}
          className='mr-2'
        />
        Prev
      </Button>
      <p className='text-14 flex items-center px-2'>
        {page} / {totalPages}
      </p>
      <Button
        size='lg'
        variant='ghost'
        className='p-0 hover:bg-transparent'
        onClick={() => handleNavigation('next')}
        disabled={Number(page) >= totalPages}
      >
        Next
        <Image
          src='/icons/arrow-left.svg'
          alt='arrow'
          width={20}
          height={20}
          className='ml-2 -scale-x-100'
        />
      </Button>
    </div>
  );
}
