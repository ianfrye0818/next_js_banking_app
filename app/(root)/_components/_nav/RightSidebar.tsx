import BankCard from '../_common/BankCard';
import PlaidLink from '@/app/(auth)/_components/_authform/PlaidLink';
import { countTransactionCategories } from '@/lib/utils';
import { Category } from '../_common/Category';

export default function RightSidebar({ banks, transactions, user }: RightSidebarProps) {
  const categories = countTransactionCategories(transactions);
  return (
    <aside className='right-sidebar'>
      <section className='flex flex-col pb-8'>
        <div className='profile-banner' />
        <div className='profile'>
          <div className='profile-img'>
            <span className='text-5xl font-bold text-blue-500'>{user.name[0]}</span>
          </div>
          <div className='profile-details'>
            <h1 className='profile-name'>{user.name}</h1>
            <p className='profile-email'>{user?.email}</p>
          </div>
        </div>
      </section>
      <section className='banks'>
        <div className='flex w-full justify-between'>
          <h2 className='header-2'>My Banks</h2>
          <PlaidLink
            variant='link'
            user={user}
          />
        </div>
        {banks?.length > 0 && (
          <div className=' relative flex flex-1 flex-col items-center justify-center gap-5'>
            <div className='relative z-10'>
              <BankCard
                key={banks[0].id}
                account={banks[0]}
                userName={user.name}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className='absolute right-0 top-8 z-0 w-[90%]'>
                <BankCard
                  key={banks[1].id}
                  account={banks[1]}
                  userName={user.name}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
        <div className='mt-10 flex flex-1 flex-col gap-6'>
          <h2 className='header-2'>Top Categories</h2>
          <div className='space-y-5'>
            {categories.map((category, index) => (
              <Category
                key={category.name}
                category={category}
              />
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
}
