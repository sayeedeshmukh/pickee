import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/** Legacy /deep-link route — sends users to results with reflection open. */
export default function MindsetRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/decisions/${id}/results`, { replace: true, state: { openReflection: true } });
  }, [id, navigate]);

  return null;
}
