import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function useErrors(error: any) {
  try {
    const errors = error.response.data.errors
    const keys = Object.keys(errors);
    const values = keys.map((key) => errors[key]);

    values.flatMap((item: any) => {
      return item.map((error: any) => toast.error(error));
    });
  } catch (error) {
    toast.error("Ocorreu um erro desconhecido.");
  }
}
