import { useState, useEffect } from "react";
import {
  fetchReceivedMateRequests,
  fetchMatesList,
  acceptMateRequest,
  rejectMateRequest,
  deleteMate,
} from "../api/mates.api";
import { IMate, IRequestMate } from "../models/user.model";

export const useReceivedMateRequests = (user_id: number) => {
  const [receivedRequests, setReceivedRequests] = useState<IRequestMate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsData = await fetchReceivedMateRequests(user_id);
        console.log("Received Requests:", requestsData);
        setReceivedRequests(requestsData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user_id]);

  return {
    receivedRequests,
    loading,
  };
};

export const useMatesList = (user_id: number) => {
  const [mates, setMates] = useState<IMate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMates = async () => {
      try {
        const matesData = await fetchMatesList(user_id);
        console.log("Mates Data:", matesData);
        setMates(matesData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchMates();
  }, [user_id]);

  return {
    mates,
    loading,
  };
};
export const useAcceptMateRequest = (user_id: number) => {
  const [receivedRequests, setReceivedRequests] = useState<IRequestMate[]>([]);

  const handleAcceptRequest = async (requestID: number) => {
    try {
      await acceptMateRequest(user_id, requestID);
      setReceivedRequests((prev) =>
        prev.filter((request) => request.user_id !== requestID)
      );
      window.location.reload();
    } catch (error) {
      console.error("친구 요청을 수락하는 중 오류가 발생했습니다.", error);
    }
  };

  return {
    handleAcceptRequest,
    setReceivedRequests,
  };
};

export const useRejectMateRequest = (user_id: number) => {
  const [receivedRequests, setReceivedRequests] = useState<IRequestMate[]>([]);

  const handleRejectRequest = async (requestID: number) => {
    try {
      await rejectMateRequest(user_id, requestID);
      setReceivedRequests((prev) =>
        prev.filter((request) => request.user_id !== requestID)
      );
      window.location.reload();
    } catch (error) {
      console.error("친구 요청을 거절하는 중 오류가 발생했습니다.", error);
    }
  };

  return {
    handleRejectRequest,
    setReceivedRequests,
  };
};

// useDeleteMate.tsx
export const useDeleteMate = (user_id: number, updateMatesList: () => void) => {
  const [mates, setMates] = useState<IMate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleDeleteMate = async (mate_id: number) => {
    setLoading(true);
    try {
      await deleteMate(user_id, mate_id);
      setMates((prevMates) => prevMates.filter((mate) => mate.user_id !== mate_id));
      updateMatesList(); // 친구 삭제 후, 목록을 다시 불러옵니다.
    } catch (err) {
      setError(err as Error);
      console.error("친구를 삭제하는 중 오류가 발생했습니다.", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    mates, 
    setMates, 
    loading,
    error,
    handleDeleteMate,
  };
};


