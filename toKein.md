https://api2.potanshop.com/api/money/historyGrouped?interval=daily&page=1
https://api2.potanshop.com/api/money/historyGrouped?interval=weekly&page=1
https://api2.potanshop.com/api/money/historyGrouped?interval=monthly&page=1

transaction တစ်ကြောင်းတည်း data ရှိပေမယ့်
interval ပြောင်းရင် date ပြောင်းပြီး response ပြန်နေပါတယ်။
daily:
"data": [
{
"bucket": "2026-02-03",
"net_amount": "1000.00",
"first_balance_before": "0.00",
"last_balance_after": "1000.00",
"tx_count": 1
}
],

weekly:
"data": [
{
"bucket": "2026-02-02",
"net_amount": "1000.00",
"first_balance_before": "0.00",
"last_balance_after": "1000.00",
"tx_count": 1
}
],

monthly:
"data": [
{
"bucket": "2026-02",
"net_amount": "1000.00",
"first_balance_before": "0.00",
"last_balance_after": "1000.00",
"tx_count": 1
}
],
