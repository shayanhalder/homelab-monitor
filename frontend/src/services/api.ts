import axios from 'axios';
import { SystemStats, CpuStats, MemoryStats, DiskIOStats, NetworkStats, ProcessInfo } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchSystemStats = async (): Promise<SystemStats> => {
  const response = await api.get<SystemStats>('/api/monitoring/all');
  return response.data;
};

export const fetchCpuStats = async (): Promise<CpuStats> => {
  const response = await api.get<CpuStats>('/api/monitoring/cpu');
  return response.data;
};

export const fetchMemoryStats = async (): Promise<MemoryStats> => {
  const response = await api.get<MemoryStats>('/api/monitoring/memory');
  return response.data;
};

export const fetchDiskIOStats = async (): Promise<DiskIOStats[]> => {
  const response = await api.get<DiskIOStats[]>('/api/monitoring/disk');
  return response.data;
};

export const fetchNetworkStats = async (): Promise<NetworkStats[]> => {
  const response = await api.get<NetworkStats[]>('/api/monitoring/network');
  return response.data;
};

export const fetchTopProcesses = async (limit: number = 10): Promise<ProcessInfo[]> => {
  const response = await api.get<ProcessInfo[]>(`/api/monitoring/processes?limit=${limit}`);
  return response.data;
};

