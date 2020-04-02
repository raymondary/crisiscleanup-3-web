import { Model } from '@vuex-orm/core';

export default class PhoneOutbound extends Model {
  static entity = 'phone_outbound';

  static fields() {
    return {
      id: this.attr(),
      phone_number: this.attr(),
      vm_url: this.attr(),
      call_type: this.attr(),
      completion: this.attr(),
      incident_id: this.attr(),
      inbound_at: this.attr(),
      created_at: this.attr(),
      updated_at: this.attr(),
      locked_at: this.attr(),
      dnis1: this.attr(),
      dnis2: this.attr(),
      ani: this.attr(),
      worksite: this.attr(),
      pda: this.attr(),
      language: this.attr(),
      created_by: this.attr(),
      updated_by: this.attr(),
      latest_status: this.attr(),
    };
  }

  static apiConfig = {
    actions: {
      async getNextOutbound() {
        const phoneOutbound = await this.get(`/phone_outbound?next=1`);
        return phoneOutbound;
      },
      async updateStatus(id, statusId, worksiteId) {
        await this.post(
          `/phone_outbound/${id}/update_status`,
          {
            status: statusId,
            worksite: worksiteId,
          },
          { save: false },
        );
      },
    },
  };
}
