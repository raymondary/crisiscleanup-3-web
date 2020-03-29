import { Model } from '@vuex-orm/core';
import moment from 'moment';

export default class PasswordResetRequest extends Model {
  static entity = 'password_reset_requests';

  static fields() {
    return {
      id: this.attr(),
      email: this.string(''),
      requested_at: this.attr(null),
      expires_at: this.attr(null),
      is_expired: this.attr(null),
    };
  }

  get requested_at_moment() {
    if (this.requested_at) {
      return moment(this.requested_at).format('DD/MM/YYYY');
    }
    return '';
  }

  get expires_at_moment() {
    if (this.expires_at) {
      return moment(this.expires_at).format('DD/MM/YYYY');
    }
    return '';
  }

  static apiConfig = {
    actions: {
      reset(token, password) {
        return this.post(
          `/password_reset_requests/${token}/reset`,
          {
            password,
            password_reset_token: token,
          },
          { save: false },
        );
      },
    },
  };
}