import fetch from "node-fetch";

const BASE_URL = "https://api.createsend.com/api/v3.3";

export class CampaignMonitorClient {
  private authHeader: string;

  constructor(apiKey: string) {
    this.authHeader =
      "Basic " + Buffer.from(`${apiKey}:x`).toString("base64");
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    queryParams?: Record<string, string | number | undefined>
  ): Promise<T> {
    let url = `${BASE_URL}${path}`;

    if (queryParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          params.set(key, String(value));
        }
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errBody = (await response.json()) as {
          Message?: string;
          Code?: number;
        };
        if (errBody.Message) {
          errorMessage = `Campaign Monitor API Error (${errBody.Code ?? response.status}): ${errBody.Message}`;
        }
      } catch {
        // ignore parse error
      }
      throw new Error(errorMessage);
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const text = await response.text();
    if (!text) return undefined as unknown as T;
    return JSON.parse(text) as T;
  }

  // ─── Campaigns ────────────────────────────────────────────────────────────

  async listCampaigns(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/campaigns.json`);
  }

  async listDraftCampaigns(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/drafts.json`);
  }

  async listScheduledCampaigns(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/scheduled.json`);
  }

  async getCampaignSummary(campaignId: string) {
    return this.request<unknown>(
      "GET",
      `/campaigns/${campaignId}/summary.json`
    );
  }

  async getCampaignRecipients(
    campaignId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/campaigns/${campaignId}/recipients.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getCampaignBounces(
    campaignId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/campaigns/${campaignId}/bounces.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getCampaignOpens(
    campaignId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/campaigns/${campaignId}/opens.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getCampaignClicks(
    campaignId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/campaigns/${campaignId}/clicks.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getCampaignUnsubscribes(
    campaignId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/campaigns/${campaignId}/unsubscribes.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async createCampaign(
    clientId: string,
    params: {
      Name: string;
      Subject: string;
      FromName: string;
      FromEmail: string;
      ReplyTo: string;
      HtmlUrl?: string;
      TextUrl?: string;
      ListIDs?: string[];
      SegmentIDs?: string[];
    }
  ) {
    return this.request<unknown>("POST", `/campaigns/${clientId}.json`, params);
  }

  async sendCampaign(
    campaignId: string,
    params: { ConfirmationEmail: string; SendDate: string }
  ) {
    return this.request<unknown>(
      "POST",
      `/campaigns/${campaignId}/send.json`,
      params
    );
  }

  async scheduleCampaign(
    campaignId: string,
    params: { ConfirmationEmail: string; SendDate: string }
  ) {
    return this.request<unknown>(
      "POST",
      `/campaigns/${campaignId}/schedule.json`,
      params
    );
  }

  async unscheduleCampaign(campaignId: string) {
    return this.request<unknown>(
      "DELETE",
      `/campaigns/${campaignId}/schedule.json`
    );
  }

  async deleteCampaign(campaignId: string) {
    return this.request<unknown>("DELETE", `/campaigns/${campaignId}.json`);
  }

  // ─── Lists ─────────────────────────────────────────────────────────────────

  async getLists(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/lists.json`);
  }

  async createList(
    clientId: string,
    params: {
      Title: string;
      UnsubscribePage?: string;
      ConfirmedOptInPage?: string;
      ConfirmationSuccessPage?: string;
    }
  ) {
    return this.request<unknown>("POST", `/lists/${clientId}.json`, params);
  }

  async getListDetails(listId: string) {
    return this.request<unknown>("GET", `/lists/${listId}.json`);
  }

  async updateList(
    listId: string,
    params: {
      Title: string;
      UnsubscribePage?: string;
      ConfirmedOptInPage?: string;
      ConfirmationSuccessPage?: string;
    }
  ) {
    return this.request<unknown>("PUT", `/lists/${listId}.json`, params);
  }

  async deleteList(listId: string) {
    return this.request<unknown>("DELETE", `/lists/${listId}.json`);
  }

  async getActiveSubscribers(
    listId: string,
    date?: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/lists/${listId}/active.json`,
      undefined,
      { date, page, pagesize: pageSize }
    );
  }

  async getBouncedSubscribers(
    listId: string,
    date?: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/lists/${listId}/bounced.json`,
      undefined,
      { date, page, pagesize: pageSize }
    );
  }

  async getUnsubscribedSubscribers(
    listId: string,
    date?: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/lists/${listId}/unsubscribed.json`,
      undefined,
      { date, page, pagesize: pageSize }
    );
  }

  async getListStats(listId: string) {
    return this.request<unknown>("GET", `/lists/${listId}/stats.json`);
  }

  async getSegments(listId: string) {
    return this.request<unknown>("GET", `/lists/${listId}/segments.json`);
  }

  async getWebhooks(listId: string) {
    return this.request<unknown>("GET", `/lists/${listId}/webhooks.json`);
  }

  // ─── Subscribers ───────────────────────────────────────────────────────────

  async addSubscriber(
    listId: string,
    params: {
      EmailAddress: string;
      Name?: string;
      CustomFields?: Array<{ Key: string; Value: string }>;
      Resubscribe?: boolean;
      ConsentToTrack: "Yes" | "No" | "Unchanged";
    }
  ) {
    return this.request<unknown>("POST", `/subscribers/${listId}.json`, params);
  }

  async getSubscriberDetails(listId: string, email: string) {
    return this.request<unknown>(
      "GET",
      `/subscribers/${listId}.json`,
      undefined,
      { email }
    );
  }

  async updateSubscriber(
    listId: string,
    email: string,
    params: {
      EmailAddress?: string;
      Name?: string;
      CustomFields?: Array<{ Key: string; Value: string }>;
      ConsentToTrack?: "Yes" | "No" | "Unchanged";
    }
  ) {
    return this.request<unknown>(
      "PUT",
      `/subscribers/${listId}.json`,
      params,
      { email }
    );
  }

  async unsubscribeSubscriber(listId: string, email: string) {
    return this.request<unknown>(
      "POST",
      `/subscribers/${listId}/unsubscribe.json`,
      { EmailAddress: email }
    );
  }

  async deleteSubscriber(listId: string, email: string) {
    return this.request<unknown>(
      "DELETE",
      `/subscribers/${listId}.json`,
      undefined,
      { email }
    );
  }

  async importSubscribers(
    listId: string,
    subscribers: Array<{
      EmailAddress: string;
      Name?: string;
      CustomFields?: Array<{ Key: string; Value: string }>;
      ConsentToTrack: "Yes" | "No" | "Unchanged";
    }>,
    resubscribe?: boolean,
    queueSubscriptionBasedAutoResponders?: boolean
  ) {
    return this.request<unknown>(
      "POST",
      `/subscribers/${listId}/import.json`,
      {
        Subscribers: subscribers,
        Resubscribe: resubscribe,
        QueueSubscriptionBasedAutoResponders:
          queueSubscriptionBasedAutoResponders,
      }
    );
  }

  // ─── Clients ───────────────────────────────────────────────────────────────

  async getClients() {
    return this.request<unknown>("GET", "/clients.json");
  }

  async getClientDetails(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}.json`);
  }

  async getClientLists(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/lists.json`);
  }

  async getClientSegments(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/segments.json`);
  }

  async getClientTemplates(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/templates.json`);
  }

  // ─── Transactional ─────────────────────────────────────────────────────────

  async sendClassicEmail(params: {
    To: string[];
    CC?: string[];
    BCC?: string[];
    From: string;
    ReplyTo?: string;
    Subject: string;
    HTML?: string;
    Text?: string;
    Attachments?: Array<{ Name: string; Type: string; Content: string }>;
    ConsentToTrack: "Yes" | "No" | "Unchanged";
  }) {
    return this.request<unknown>(
      "POST",
      "/transactional/classicEmail/send",
      params
    );
  }

  async sendSmartEmail(params: {
    smartEmailId: string;
    To: string[];
    CC?: string[];
    BCC?: string[];
    ConsentToTrack: "Yes" | "No" | "Unchanged";
    Data?: Record<string, unknown>;
  }) {
    const { smartEmailId, ...body } = params;
    return this.request<unknown>(
      "POST",
      `/transactional/smartEmail/${smartEmailId}/send`,
      body
    );
  }

  async listSmartEmails(clientId: string) {
    return this.request<unknown>(
      "GET",
      `/transactional/smartEmail`,
      undefined,
      { clientID: clientId }
    );
  }

  async getTransactionalStats(params?: {
    clientID?: string;
    from?: string;
    to?: string;
    timezone?: string;
    group?: string;
  }) {
    return this.request<unknown>(
      "GET",
      "/transactional/statistics",
      undefined,
      params as Record<string, string | number | undefined>
    );
  }

  async getTransactionalTimeline(params?: {
    clientID?: string;
    status?: string;
    count?: number;
    sentAfterID?: string;
    sentBeforeID?: string;
  }) {
    return this.request<unknown>(
      "GET",
      "/transactional/messages",
      undefined,
      params as Record<string, string | number | undefined>
    );
  }

  // ─── Templates ─────────────────────────────────────────────────────────────

  async getTemplates(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/templates.json`);
  }

  async getTemplateDetails(templateId: string) {
    return this.request<unknown>("GET", `/templates/${templateId}.json`);
  }

  async createTemplate(
    clientId: string,
    params: { Name: string; HtmlPageURL?: string; ZipFileURL?: string }
  ) {
    return this.request<unknown>("POST", `/templates/${clientId}.json`, params);
  }

  async updateTemplate(
    templateId: string,
    params: { Name: string; HtmlPageURL?: string; ZipFileURL?: string }
  ) {
    return this.request<unknown>("PUT", `/templates/${templateId}.json`, params);
  }

  async deleteTemplate(templateId: string) {
    return this.request<unknown>("DELETE", `/templates/${templateId}.json`);
  }

  async copyTemplate(templateId: string, clientId: string) {
    return this.request<unknown>(
      "POST",
      `/templates/${templateId}/copy.json`,
      { ClientID: clientId }
    );
  }

  // ─── Account ───────────────────────────────────────────────────────────────

  async getBillingDetails() {
    return this.request<unknown>("GET", "/billingdetails.json");
  }

  async getCountries() {
    return this.request<unknown>("GET", "/countries.json");
  }

  async getTimezones() {
    return this.request<unknown>("GET", "/timezones.json");
  }

  async getSystemDate() {
    return this.request<unknown>("GET", "/systemdate.json");
  }

  async getAdmins() {
    return this.request<unknown>("GET", "/admins.json");
  }

  async getAdmin(email: string) {
    return this.request<unknown>("GET", "/admins.json", undefined, { email });
  }

  async addAdmin(params: { EmailAddress: string; Name: string }) {
    return this.request<unknown>("POST", "/admins.json", params);
  }

  async updateAdmin(
    email: string,
    params: { EmailAddress: string; Name: string }
  ) {
    return this.request<unknown>("PUT", "/admins.json", params, { email });
  }

  async deleteAdmin(email: string) {
    return this.request<unknown>("DELETE", "/admins.json", undefined, {
      email,
    });
  }

  async getPrimaryContact() {
    return this.request<unknown>("GET", "/primarycontact.json");
  }

  async setPrimaryContact(email: string) {
    return this.request<unknown>(
      "PUT",
      "/primarycontact.json",
      undefined,
      { email }
    );
  }

  // ─── Campaigns (extra) ─────────────────────────────────────────────────────

  async sendCampaignPreview(
    campaignId: string,
    params: { PreviewRecipients: string[]; Personalize?: string }
  ) {
    return this.request<unknown>(
      "POST",
      `/campaigns/${campaignId}/sendpreview.json`,
      params
    );
  }

  async createCampaignFromTemplate(clientId: string, params: object) {
    return this.request<unknown>(
      "POST",
      `/campaigns/${clientId}/fromtemplate.json`,
      params
    );
  }

  async getCampaignSpamComplaints(
    campaignId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/campaigns/${campaignId}/spam.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getCampaignEmailClientUsage(campaignId: string) {
    return this.request<unknown>(
      "GET",
      `/campaigns/${campaignId}/emailclientusage.json`
    );
  }

  async getCampaignListsAndSegments(campaignId: string) {
    return this.request<unknown>(
      "GET",
      `/campaigns/${campaignId}/listsandsegments.json`
    );
  }

  // ─── Clients (extra) ───────────────────────────────────────────────────────

  async createClient(params: {
    CompanyName: string;
    Country: string;
    TimeZone: string;
  }) {
    return this.request<unknown>("POST", "/clients.json", params);
  }

  async deleteClient(clientId: string) {
    return this.request<unknown>("DELETE", `/clients/${clientId}.json`);
  }

  async getListsForEmail(clientId: string, email: string) {
    return this.request<unknown>(
      "GET",
      `/clients/${clientId}/listsforemail.json`,
      undefined,
      { email }
    );
  }

  async getSuppressionList(
    clientId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/clients/${clientId}/suppressionlist.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async addToSuppressionList(clientId: string, emails: string[]) {
    return this.request<unknown>(
      "POST",
      `/clients/${clientId}/suppress.json`,
      { EmailAddresses: emails }
    );
  }

  async removeFromSuppressionList(clientId: string, email: string) {
    return this.request<unknown>(
      "PUT",
      `/clients/${clientId}/unsuppress.json`,
      undefined,
      { email }
    );
  }

  async getClientPeople(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/people.json`);
  }

  async addClientPerson(
    clientId: string,
    params: {
      EmailAddress: string;
      Name: string;
      AccessLevel: number;
      Password: string;
    }
  ) {
    return this.request<unknown>(
      "POST",
      `/clients/${clientId}/people.json`,
      params
    );
  }

  async updateClientPerson(
    clientId: string,
    email: string,
    params: { EmailAddress: string; Name: string; AccessLevel: number }
  ) {
    return this.request<unknown>(
      "PUT",
      `/clients/${clientId}/people.json`,
      params,
      { email }
    );
  }

  async deleteClientPerson(clientId: string, email: string) {
    return this.request<unknown>(
      "DELETE",
      `/clients/${clientId}/people.json`,
      undefined,
      { email }
    );
  }

  async getClientPrimaryContact(clientId: string) {
    return this.request<unknown>(
      "GET",
      `/clients/${clientId}/primarycontact.json`
    );
  }

  async setClientPrimaryContact(clientId: string, email: string) {
    return this.request<unknown>(
      "PUT",
      `/clients/${clientId}/primarycontact.json`,
      undefined,
      { email }
    );
  }

  async getClientTags(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/tags.json`);
  }

  async getSendingDomains(clientId: string) {
    return this.request<unknown>(
      "GET",
      `/clients/${clientId}/sendingdomains.json`
    );
  }

  async addSendingDomain(clientId: string, domain: string) {
    return this.request<unknown>(
      "POST",
      `/clients/${clientId}/sendingdomains.json`,
      { Domain: domain }
    );
  }

  async deleteSendingDomain(clientId: string, domain: string) {
    return this.request<unknown>(
      "DELETE",
      `/clients/${clientId}/sendingdomains.json`,
      { Domain: domain }
    );
  }

  async transferCredits(
    clientId: string,
    params: { Credits: number; CanUseMyCreditsWhenTheyRunOut: boolean }
  ) {
    return this.request<unknown>(
      "POST",
      `/clients/${clientId}/credits.json`,
      params
    );
  }

  async updateClientBasics(
    clientId: string,
    params: { CompanyName: string; Country: string; TimeZone: string }
  ) {
    return this.request<unknown>("PUT", `/clients/${clientId}/setbasics.json`, params);
  }

  async setClientPaygBilling(
    clientId: string,
    params: { Currency: string; CanPurchaseCredits: boolean; ClientPays: boolean; MarkupPercentage: number }
  ) {
    return this.request<unknown>("PUT", `/clients/${clientId}/setpaygbilling.json`, params);
  }

  async setClientMonthlyBilling(
    clientId: string,
    params: { Currency: string; ClientPays: boolean; MarkupPercentage: number; MonthlyScheme: string }
  ) {
    return this.request<unknown>("PUT", `/clients/${clientId}/setmonthlybilling.json`, params);
  }

  async copySendingDomain(clientId: string, domain: string, destinationClientId: string) {
    return this.request<unknown>(
      "POST",
      `/clients/${clientId}/sendingdomains/copy.json`,
      { Domain: domain, DestinationClientID: destinationClientId }
    );
  }

  async authenticateSendingDomain(clientId: string, domain: string) {
    return this.request<unknown>(
      "PUT",
      `/clients/${clientId}/sendingdomains/authenticate.json`,
      { Domain: domain }
    );
  }

  async createExternalSession(params: { Email: string; Chrome: string; Url: string; IntegratorID: string; ClientID: string }) {
    return this.request<unknown>("PUT", `/externalsession.json`, params);
  }

  // ─── Journeys ──────────────────────────────────────────────────────────────

  async getJourneys(clientId: string) {
    return this.request<unknown>("GET", `/clients/${clientId}/journeys.json`);
  }

  async getJourneySummary(journeyId: string) {
    return this.request<unknown>("GET", `/journeys/${journeyId}.json`);
  }

  async getJourneyEmailRecipients(
    emailId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/journeys/email/${emailId}/recipients.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getJourneyEmailOpens(
    emailId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/journeys/email/${emailId}/opens.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getJourneyEmailClicks(
    emailId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/journeys/email/${emailId}/clicks.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getJourneyEmailBounces(
    emailId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/journeys/email/${emailId}/bounces.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getJourneyEmailUnsubscribes(
    emailId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/journeys/email/${emailId}/unsubscribes.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async publishEvent(clientId: string, params: object) {
    return this.request<unknown>("POST", `/events/publish/${clientId}`, params);
  }

  async copyJourney(journeyId: string, clientId: string) {
    return this.request<unknown>("POST", `/journeys/${journeyId}/copy.json`, { ClientID: clientId });
  }

  // ─── Lists (extra) ─────────────────────────────────────────────────────────

  async getUnconfirmedSubscribers(
    listId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/lists/${listId}/unconfirmed.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getDeletedSubscribers(
    listId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/lists/${listId}/deleted.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  async getCustomFields(listId: string) {
    return this.request<unknown>("GET", `/lists/${listId}/customfields.json`);
  }

  async createCustomField(
    listId: string,
    params: {
      FieldName: string;
      DataType: string;
      VisibleInPreferenceCenter?: boolean;
    }
  ) {
    return this.request<unknown>(
      "POST",
      `/lists/${listId}/customfields.json`,
      params
    );
  }

  async updateCustomField(
    listId: string,
    key: string,
    params: { FieldName: string; VisibleInPreferenceCenter?: boolean }
  ) {
    const encodedKey = encodeURIComponent(key);
    return this.request<unknown>(
      "PUT",
      `/lists/${listId}/customfields/${encodedKey}.json`,
      params
    );
  }

  async deleteCustomField(listId: string, key: string) {
    const encodedKey = encodeURIComponent(key);
    return this.request<unknown>(
      "DELETE",
      `/lists/${listId}/customfields/${encodedKey}.json`
    );
  }

  async updateCustomFieldOptions(listId: string, key: string, options: string[], keepExisting: boolean) {
    const encodedKey = encodeURIComponent(key);
    return this.request<unknown>(
      "PUT",
      `/lists/${listId}/customfields/${encodedKey}/options.json`,
      { Options: options, KeepExistingOptions: keepExisting }
    );
  }

  async createWebhook(
    listId: string,
    params: { Events: string[]; Url: string; PayloadFormat: string }
  ) {
    return this.request<unknown>(
      "POST",
      `/lists/${listId}/webhooks.json`,
      params
    );
  }

  async testWebhook(listId: string, webhookId: string) {
    return this.request<unknown>(
      "GET",
      `/lists/${listId}/webhooks/${webhookId}/test.json`
    );
  }

  async deleteWebhook(listId: string, webhookId: string) {
    return this.request<unknown>(
      "DELETE",
      `/lists/${listId}/webhooks/${webhookId}.json`
    );
  }

  async activateWebhook(listId: string, webhookId: string) {
    return this.request<unknown>(
      "PUT",
      `/lists/${listId}/webhooks/${webhookId}/activate.json`
    );
  }

  async deactivateWebhook(listId: string, webhookId: string) {
    return this.request<unknown>(
      "PUT",
      `/lists/${listId}/webhooks/${webhookId}/deactivate.json`
    );
  }

  // ─── Segments ──────────────────────────────────────────────────────────────

  async createSegment(
    listId: string,
    params: { Title: string; RuleGroups?: object[] }
  ) {
    return this.request<unknown>("POST", `/segments/${listId}.json`, params);
  }

  async updateSegment(
    segmentId: string,
    params: { Title: string; RuleGroups?: object[] }
  ) {
    return this.request<unknown>("PUT", `/segments/${segmentId}.json`, params);
  }

  async getSegmentDetails(segmentId: string) {
    return this.request<unknown>("GET", `/segments/${segmentId}.json`);
  }

  async deleteSegment(segmentId: string) {
    return this.request<unknown>("DELETE", `/segments/${segmentId}.json`);
  }

  async addSegmentRuleGroup(segmentId: string, ruleGroup: object) {
    return this.request<unknown>(
      "POST",
      `/segments/${segmentId}/rules.json`,
      ruleGroup
    );
  }

  async clearSegmentRules(segmentId: string) {
    return this.request<unknown>(
      "DELETE",
      `/segments/${segmentId}/rules.json`
    );
  }

  async getSegmentSubscribers(
    segmentId: string,
    page?: number,
    pageSize?: number
  ) {
    return this.request<unknown>(
      "GET",
      `/segments/${segmentId}/active.json`,
      undefined,
      { page, pagesize: pageSize }
    );
  }

  // ─── Subscribers (extra) ───────────────────────────────────────────────────

  async getSubscriberHistory(listId: string, email: string) {
    return this.request<unknown>(
      "GET",
      `/subscribers/${listId}/history.json`,
      undefined,
      { email }
    );
  }

  // ─── Transactional (extra) ─────────────────────────────────────────────────

  async getSmartEmailDetails(smartEmailId: string) {
    return this.request<unknown>(
      "GET",
      `/transactional/smartEmail/${smartEmailId}`
    );
  }

  async getClassicEmailGroups(clientId?: string) {
    return this.request<unknown>(
      "GET",
      "/transactional/classicEmail/groups",
      undefined,
      clientId ? { clientID: clientId } : undefined
    );
  }

  async getTransactionalMessageDetails(messageId: string) {
    return this.request<unknown>(
      "GET",
      `/transactional/messages/${messageId}`
    );
  }

  async resendTransactionalMessage(messageId: string) {
    return this.request<unknown>(
      "POST",
      `/transactional/messages/${messageId}/resend`
    );
  }
}
