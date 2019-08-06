<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <div class="headline">Group 5A</div>
        </v-card-title>
        <v-card-text>
          Ng Sze Yeung Chris (51470300)
          <br />Pang Chun Lam (55750220)
          <br />Yeung Chun Ho (55749780)
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-divider class="primary my-4"></v-divider>
    </v-flex>
    <v-flex xs12>
      <v-container grid-list-md class="px-0">
        <v-layout>
          <v-flex xs12 md6>
            <v-card>
              <v-card-title>
                <div class="headline">Model 1</div>
              </v-card-title>
              <v-card-text>
                <v-treeview :items="model1" dense open-on-click open-all>
                  <template v-slot:prepend="{ item, open }">
                    <v-icon color="primary">{{getIcon(item)}}</v-icon>
                  </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 md6>
            <v-card>
              <v-card-title>
                <div class="headline">
                  Model 2
                  <v-icon color="primary">mdi-check</v-icon>
                </div>
              </v-card-title>
              <v-card-text>
                <v-treeview :items="model2" dense open-on-click open-all>
                  <template v-slot:prepend="{ item, open }">
                    <v-icon color="primary">{{getIcon(item)}}</v-icon>
                  </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      model1: [
        {
          id: 1,
          name: "departments",
          collection: true,
          children: [
            { name: "_id: ObjectId", key: true },
            { name: 'deptId: "CS"', unique: true },
            { name: 'deptName: "Computer Science"' },
            { name: 'location: "Green Zone"' }
          ]
        },
        {
          id: 2,
          name: "courses",
          collection: true,
          children: [
            { name: "_id: ObjectId", key: true },
            { name: 'courseId: "CS101"', unique: true },
            { name: 'title: "Introduction to Data Science"' },
            { name: "level: 6" },
            { name: "department: ObjectId(department._id)" }
          ]
        },
        {
          id: 3,
          name: "offer",
          collection: true,
          children: [
            { name: "_id: ObjectId", key: true },
            { name: "course: ObjectId(course._id)", unique: true },
            { name: "year: 2016", unique: true },
            { name: "classSize: 40" },
            { name: "availablePlaces: 39" },
            { name: "enrolledCount: 1" }
          ]
        },
        {
          id: 4,
          name: "students",
          collection: true,
          children: [
            { name: '_id: "15101010"', key: true },
            { name: 'stuName: "Chan Tai Man"' },
            { name: 'dOB: new Date("1997-05-15")' },
            {
              id: 41,
              name: "enrolled",
              children: [
                {
                  id: 411,
                  name: "0",
                  children: [
                    { name: "courseID: ObjectId(course._id)" },
                    { name: 'enrolDate: new Date("2016-05-15 08:30:00")' }
                  ]
                },
                {
                  id: 412,
                  name: "1",
                  children: [
                    { name: "courseID: ObjectId(course._id)" },
                    { name: 'enrolDate: new Date("2017-05-15 10:30:00")' }
                  ]
                }
              ]
            }
          ]
        }
      ],
      model2: [
        {
          id: 1,
          name: "departments",
          collection: true,
          children: [
            { name: "_id: ObjectId", key: true },
            { name: 'deptId: "CS"', unique: true },
            { name: 'deptName: "Computer Science"' },
            { name: 'location: "Green Zone"' },
            {
              id: 11,
              name: "courses",
              children: [
                {
                  id: 111,
                  name: "0",
                  children: [
                    { name: 'courseId: "CS101"' },
                    { name: 'title: "Introduction to Data Science"' },
                    { name: "level: 6" }
                  ]
                },
                {
                  id: 112,
                  name: "1",
                  children: [
                    { name: 'courseId: "CS102"' },
                    { name: 'title: "Introduction to Computer Science"' },
                    { name: "level: 5" }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "offer",
          collection: true,
          children: [
            { name: "_id: ObjectId", key: true },
            {
              id: 21,
              name: "course",
              children: [
                { name: 'courseId: "CS101"', unique: true },
                { name: 'title: "Introduction to Data Science"' },
                { name: "level: 6" }
              ]
            },
            { name: "year: 2016", unique: true },
            { name: "department: ObjectId(department._id)" },
            { name: "classSize: 40" },
            { name: "availablePlaces: 39" },
            { name: "enrolledCount: 1" },
            {
              id: 22,
              name: "enrolled",
              children: [
                {
                  id: 221,
                  name: "0",
                  children: [
                    { name: 'student: "15101010"' },
                    { name: 'enrolDate: new Date("2016-05-15 08:30:00")' }
                  ]
                },
                {
                  id: 222,
                  name: "1",
                  children: [
                    { name: 'student: "15101011"' },
                    { name: 'enrolDate: new Date("2017-05-15 10:30:00")' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 3,
          name: "students",
          collection: true,
          children: [
            { name: '_id: "15101010"', key: true },
            { name: 'stuName: "Chan Tai Man"' },
            { name: 'dOB: new Date("1997-05-15")' }
          ]
        }
      ]
    };
  },
  methods: {
    getIcon(item) {
      if (item.collection) return "mdi-database";
      if (item.unique) return "mdi-alpha-u-box";
      if (item.key) return "mdi-key";
    }
  }
};
</script>
