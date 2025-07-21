"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputRupiahProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}


export function InputRupiah({
  value,
  onChange,
  className,
  placeholder,
}: InputRupiahProps) {
  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^,\d]/g, "");
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substring(0, sisa);
    const ribuan = split[0].substring(sisa).match(/\d{3}/g);
    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }
    return split[1] !== undefined ? `Rp${rupiah},${split[1]}` : `Rp${rupiah}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    onChange(raw); 
  };

  return (
    <input
      type="text"
      className={className}
      value={formatRupiah(value)}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
}
