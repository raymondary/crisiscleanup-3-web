<template>
  <Table
    :columns="columns"
    :data="invitations"
    :body-style="{ height: '300px' }"
    :pagination="meta.pagination"
    :loading="loading"
    @change="$emit('change', $event)"
    enable-pagination
  >
    <template #invitation_token="slotProps">
      <base-link
        :href="`/invitation_token/${slotProps.item.invitation_token}`"
        text-variant="bodysm"
        class="px-2"
        >{{ $t('actions.activate') }}</base-link
      >
    </template>
    <template #organization="slotProps">
      <base-link
        :href="`/admin/organization/${slotProps.item.organization}`"
        text-variant="bodysm"
        class="px-2"
        >{{ slotProps.item.organization }}</base-link
      >
    </template>
    <template #actions="slotProps">
      <div class="flex mr-2 justify-center w-full">
        <base-button
          size="small"
          variant="solid"
          class="m-1 mx-2 text-black font-light text-xs py-1 px-3"
          :action="
            () => {
              resendInvitation(slotProps.item);
            }
          "
          :text="$t('actions.re_invite')"
          :alt="$t('actions.re_invite')"
        />
      </div>
    </template>
  </Table>
</template>

<script>
import Table from '@/components/Table';
import User from '@/models/User';
import Invitation from '@/models/Invitation';

export default {
  name: 'InvitationTable',
  components: { Table },
  props: {
    invitations: {
      type: Array,
      default: () => [],
    },
    meta: {
      type: Object,
      default: () => {
        return {};
      },
    },
    loading: Boolean,
  },
  methods: {
    async resendInvitation(invitation) {
      await Invitation.api().resendInvitation(invitation);
      await this.loadAllInvitations();
      await this.$toasted.success(this.$t('invitationsVue.invitation_resent'));
      this.$emit('reload');
    },
  },
  computed: {
    currentUser() {
      return User.find(this.$store.getters['auth/userId']);
    },
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('invitationTables.id'),
          dataIndex: 'id',
          key: 'id',
          width: '0.5fr',
        },
        {
          title: this.$t('invitationTables.email'),
          dataIndex: 'invitee_email',
          key: 'invitee_email',
          width: '1fr',
        },
        {
          title: this.$t('invitationTables.invited_by'),
          dataIndex: 'invited_by',
          key: 'invited_by',
          width: '1fr',
          transformer: (item) => {
            return `${item.email}`;
          },
        },
        {
          title: this.$t('invitationTables.activation_link'),
          dataIndex: 'invitation_token',
          key: 'invitation_token',
          width: '1fr',
        },
        {
          title: this.$t('invitationTables.organization'),
          dataIndex: 'organization',
          key: 'organization',
          width: '1fr',
        },
        {
          title: this.$t('invitationTables.expiration_date'),
          dataIndex: 'expires_at',
          key: 'expires_at',
          width: '1fr',
          transformer: (expires_at) => {
            return this.$moment(expires_at).format('L');
          },
        },
        {
          title: this.$t(''),
          dataIndex: 'actions',
          key: 'actions',
          width: '1fr',
        },
      ],
    };
  },
};
</script>

<style scoped></style>
