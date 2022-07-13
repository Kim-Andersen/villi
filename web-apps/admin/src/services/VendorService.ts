import { pick } from 'lodash';
import { IBackendAPI } from '../api/types';
import { Vendor, VendorId, VendorInput, VendorLocationDetails, VendorLocationId, VendorLocationInput, vendorLocationInputSchema } from '../shared';
import snackbarService from '../snackbar/snackbarService';

export default class VendorService {
  constructor(private readonly api: IBackendAPI) {}

  public async updateVendorLocation(vendorLocation: VendorLocationDetails) {
    const input = vendorLocationInputSchema.parse(pick(vendorLocation, ['vendor_id', 'location_id', 'note', 'opening_hours', 'types']));
    return this.api.put<VendorLocationDetails>(`/vendors/${input.vendor_id}/locations/${vendorLocation.id}`, input);
  }

  // public async updateVendorLocation(id: VendorLocationId, vendorLocation: VendorLocationInput) {
  //   const input = vendorLocationInputSchema.parse(pick(vendorLocation, ['vendor_id', 'location_id', 'note', 'opening_hours', 'types']));
  //   return this.api.put<VendorLocationDetails>(`/vendors/${input.vendor_id}/locations/${id}`, input);
  // }

  public async deleteVendorLocation(vendorId: VendorId, id: VendorLocationId) {
    return this.api.delete(`/vendors/${vendorId}/locations/${id}`);
  }

  public async addVendorLocation(input: VendorLocationInput): Promise<VendorLocationDetails> {
    return this.api.post<VendorLocationDetails>(`/vendors/${input.vendor_id}/locations`, input);
  }

  public async deleteVendor(vendorId: VendorId): Promise<void> {
    await this.api.delete(`/vendors/${vendorId}`);
    snackbarService.showSnackbar('Vendor was deleted.', 'success');
  }

  public async createVendor(input: VendorInput): Promise<VendorId> {
    const vendorId = await this.api.post<VendorId>(`/vendors`, input);
    snackbarService.showSnackbar('Vendor was created.', 'success');
    return vendorId;
  }

  public async getVendorLocations(vendorId: VendorId): Promise<VendorLocationDetails[]> {
    return this.api.get<VendorLocationDetails[]>(`/vendors/${vendorId}/locations`);
  }

  public async getVendorList(): Promise<Vendor[]> {
    return this.api.get<Vendor[]>('/vendors');
  }

  public async getVendor(vendorId: VendorId): Promise<Vendor> {
    return this.api.get<Vendor>(`/vendors/${vendorId}`);
  }

  public async updateVendor(vendorId: VendorId, update: VendorInput): Promise<Pick<Vendor, 'updated_at'>> {
    const result = await this.api.put<Pick<Vendor, 'updated_at'>>(`/vendors/${vendorId}`, update);
    snackbarService.showSnackbar('Vendor was updated.', 'success');
    return result;
  }
}
