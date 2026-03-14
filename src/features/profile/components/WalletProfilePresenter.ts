
import { User } from '@/api/actions/user/userAPIDataTypes';

export function useWalletProfilePresenter(
  user: User,
  navigation: any,
) {
  const navigateToMoneyHistory = () => navigation.navigate('MoneyHistory');
  const navigateToPendingLoans = () => navigation.navigate('PendingLoans');
  const navigateToRepayHistory = () => navigation.navigate('RepayHistory');
  const navigateToCoinHistory = () => navigation.navigate('CoinHistory');

  const formattedBalance = user.money_balance
    ? Math.floor(parseFloat(user.money_balance) || 0).toLocaleString()
    : '0';

  const formattedDebt = user.money_debt
    ? Math.floor(Number(user.money_debt)).toLocaleString()
    : '0';

  return {
    formattedBalance,
    formattedDebt,
    navigateToMoneyHistory,
    navigateToPendingLoans,
    navigateToRepayHistory,
    navigateToCoinHistory,
  };
}
