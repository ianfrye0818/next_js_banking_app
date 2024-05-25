'use client';

import { cn, formatAmount, formUrlQuery, getAccountTypeColors } from '@/lib/utils';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export default function BankInfo({ account, type, appwriteItemId }: BankInfoProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isActive = appwriteItemId === account.appwriteItemId;
  const colors = getAccountTypeColors(account.type as AccountTypes);

  function handleChange() {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: account.appwriteItemId,
    });
    router.push(newUrl, { scroll: false });
  }

  return (
    <div
      onClick={handleChange}
      className={cn(`bank-info ${colors.bg}`, {
        'shadow-sm border-blue-700': type === 'card' && isActive,
        'rounded-xl': type === 'card',
        'hover:shadow-sm cursor-pointer': type === 'card',
      })}
    >
      <figure className={`flex-center h-fit rounded-full bg-blue-100 ${colors.lightBg}`}>
        <Image
          src={'/icons/connect-bank.svg'}
          width={20}
          height={20}
          alt={'connect bank'}
        />
      </figure>
      <div className='flex w-full flex-1 flex-col justify-center gap-1'>
        <div className='bank-info_content'>
          <h2 className={`text-16 line-clamp-1 flex-1 font-bold text-blue-900 ${colors.title}`}>
            {account.name}
          </h2>
          {type === 'full' && (
            <p
              className={`text-12 rounded-full px-3 py-1 font-medium text-blue-700 ${colors.subText} ${colors.lightBg}`}
            >
              {account.subtype}
            </p>
          )}
        </div>

        <p className={`text-16 font-medium text-blue-700 ${colors.subText}`}>
          {formatAmount(account.currentBalance)}
        </p>
      </div>
    </div>
  );
}
