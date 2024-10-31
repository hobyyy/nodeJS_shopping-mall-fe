export const currencyFormat = (value) => {
  const number = !isNaN(value) ? Number(value) : 0; // 숫자로 변환
  return number
    .toFixed(0) // 소수점 이하 0자리로 고정
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); // 천 단위마다 점 추가
};

export const cc_expires_format = (string) => {
  return string
    .replace(
      /[^0-9]/g,
      "" // To allow only numbers
    )
    .replace(
      /^([2-9])$/g,
      "0$1" // To handle 3 > 03
    )
    .replace(
      /^(1{1})([3-9]{1})$/g,
      "0$1/$2" // 13 > 01/3
    )
    .replace(
      /^0{1,}/g,
      "0" // To handle 00 > 0
    )
    .replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
      "$1/$2" // To handle 113 > 11/3
    );
};
