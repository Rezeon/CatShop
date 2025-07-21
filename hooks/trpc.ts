'use client';
import { AppRouter } from '@/scr/server/trpc/routers';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
