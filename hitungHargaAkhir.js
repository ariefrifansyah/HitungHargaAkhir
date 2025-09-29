function hitungDiskon(totalBelanja) {
  if (totalBelanja > 1000000) return 0.15;
  if (totalBelanja > 500000) return 0.10;
  return 0;
}

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka);
}

function hitungHargaAkhir(totalBelanja) {
  if (typeof totalBelanja !== "number" || totalBelanja < 0) {
    return "Masukkan total belanja yang valid!";
  }

  const diskon = hitungDiskon(totalBelanja);
  const persenDiskon = diskon * 100;
  const jumlahDiskon = totalBelanja * diskon;
  const hargaAkhir = totalBelanja - jumlahDiskon;

  return `
====================================
          Rincian Belanja
====================================
Total Belanja   : ${formatRupiah(totalBelanja)}
Persentase Diskon: ${persenDiskon}%
Jumlah Diskon    : ${formatRupiah(jumlahDiskon)}
Harga Akhir      : ${formatRupiah(hargaAkhir)}
====================================
  `.trim();
}

console.log(hitungHargaAkhir(400000));
console.log(hitungHargaAkhir(600000));
console.log(hitungHargaAkhir(1500000));
