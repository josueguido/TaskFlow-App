import { IStatus, ICreateStatus, IUpdateStatus } from "../../interfaces/status.interface"
import { NotFoundError } from "../../errors/NotFoundError";
import { createStatus, getAllStatuses, getStatusById, updateStatus, deleteStatus } from "../../models/status.model";

export const getStatuses = async (businessId: number) => {
  return await getAllStatuses(businessId);
};

export const getStatusByIdService = async (id: string, businessId: number) => {
  const status = await getStatusById(id, businessId);
  if (!status) {
    throw new NotFoundError('Status not found');
  }
  return status;
}

export const createStatusService = async (data: ICreateStatus): Promise<IStatus> => {
  const { name, order, business_id } = data;
  const status = await createStatus(name, order, business_id);
  return status;
}

export const updateStatusService = async (id: number, businessId: number, data: IUpdateStatus): Promise<IStatus> => {
  const { name, order } = data;
  const existingStatus = await getStatusById(id.toString(), businessId);
  if (!existingStatus) {
    throw new NotFoundError('Status not found');
  }

  const newName = name ?? existingStatus.name;
  const newOrder = order ?? existingStatus.order;
  const updated = await updateStatus(id, newName, newOrder, businessId);
  return updated;
};

export const deleteStatusService = async (id: number, businessId: number): Promise<IStatus> => {
  const status = await deleteStatus(id, businessId);
  if (!status) {
    throw new NotFoundError('Status not found');
  }
  return status;
}
