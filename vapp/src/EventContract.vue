<template>
  <div>
    <div class="container">
      <h1 class="text-center">Event Organization</h1>

      <div class="row">
        <div class="col-sm-12">
          <h2>Create event</h2>
          <form @submit.prevent="createEvent">
            <div class="form-group">
              <label htmlFor="name">Name</label>
              <input
                v-model="name"
                type="text"
                class="form-control"
                id="name"
              />
            </div>
            <div class="form-group">
              <label htmlFor="date">Date</label>
              <input
                v-model="date"
                type="date"
                class="form-control"
                id="date"
              />
            </div>
            <div class="form-group">
              <label htmlFor="price">Price</label>
              <input
                v-model="price"
                type="text"
                class="form-control"
                id="price"
              />
            </div>
            <div class="form-group">
              <label htmlFor="ticketCount">Ticket count</label>
              <input
                v-model="ticketCount"
                type="text"
                class="form-control"
                id="ticketCount"
              />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr />

      <div class="row">
        <div class="col-sm-12">
          <h2>Transfer tickets</h2>
          <form @submit.prevent="transferTicket">
            <div class="form-group">
              <label htmlFor="eventId">Event Id</label>
              <input
                type="text"
                v-model="eventID"
                class="form-control"
                id="eventId"
              />
            </div>
            <div class="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                type="text"
                v-model="trs_amount"
                class="form-control"
                id="amount"
              />
            </div>
            <div class="form-group">
              <label htmlFor="to">To</label>
              <input type="text" v-model="to" class="form-control" id="to" />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr />

      <div class="row">
        <div class="col-sm-12">
          <h2>Events</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Admin</th>
                <th>Name</th>
                <th>Date</th>
                <th>Price</th>
                <th>Ticket remaining</th>
                <th>Total tickets</th>
                <th>Buy</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in events" :key="event.id">
                <td>{{ event.id }}</td>
                <td>{{ event.admin }}</td>
                <td>{{ event.name }}</td>
                <td>
                  {{ new Date(parseInt(event.date) * 1000).toLocaleString() }}
                </td>
                <td>{{ event.price }}</td>
                <td>{{ event.ticketRemaining }}</td>
                <td>{{ event.ticketCount }}</td>
                <td>
                  <div v-if="isFinished(event)">
                    Event Finished
                  </div>
                  <form v-else @submit.prevent="buyTicket(event)">
                    <div class="form-group">
                      <label htmlFor="amount">Amount</label>
                      <input
                        type="text"
                        v-model="amount"
                        class="form-control"
                        id="amount"
                      />
                    </div>
                    <button type="submit" class="btn btn-primary">
                      Submit
                    </button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("accounts", ["activeAccount"]),
    ...mapGetters("drizzle", ["drizzleInstance"]),
  },
  data: () => ({
    events: undefined,
    ticketCount: undefined,
    name: undefined,
    date: undefined,
    price: undefined,
    amount: undefined,
    eventID: undefined,
    to: undefined,
    trs_amount: undefined,
  }),
  methods: {
    createEvent() {
      const date = Math.floor(new Date(this.date).getTime() / 1000);
      this.drizzleInstance.contracts.EventContract.methods
        .createEvent(this.name, date, this.price, this.ticketCount)
        .send()
        .then(() => {
          this.init();
        });
    },
    buyTicket(event) {
      let amount = parseFloat(event.price) * parseFloat(this.amount);
      this.drizzleInstance.contracts.EventContract.methods
        .buyTicket(event.id, this.amount)
        .send({ value: amount })
        .then(() => {
          this.init();
        });
    },
    transferTicket() {
      this.drizzleInstance.contracts.EventContract.methods
        .transferTicket(this.eventID, this.trs_amount, this.to)
        .send()
        .then(() => {
          this.init();
        });
    },
    isFinished(event) {
      const now = new Date().getTime();
      const eventEnd = new Date(parseInt(event.date) * 1000).getTime();
      return eventEnd > now ? false : true;
    },
    async init() {
      const contract = this.drizzleInstance.contracts.EventContract;
      let currentId = parseInt(await contract.methods.nextId().call());
      let events = [];
      for (let i = 0; i < currentId; i++) {
        events.push(
          contract.methods
            .events(i)
            .call()
            .then((res) => {
              events.push(res);
            })
        );
        this.events = events;
      }
    },
  },
  created() {
    this.init();
  },
};
</script>
