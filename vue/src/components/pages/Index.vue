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
          <v-flex xs6>
            <v-card>
              <v-card-title>
                <div class="headline">Model 1</div>
              </v-card-title>
              <v-card-text>
                <v-treeview :items="model1" dense open-on-click open-all>
                  <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="item.collection">mdi-database</v-icon>
                  </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs6>
            <v-card>
              <v-card-title>
                <div class="headline">Model 2</div>
              </v-card-title>
              <v-card-text>
                <v-treeview :items="model2" dense open-on-click open-all>
                  <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="item.collection">mdi-database</v-icon>
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
            { name: '_id: "ObjectId"' },
            { name: 'deptId: "CS"' },
            { name: 'deptName: "Computer Science"' },
            { name: 'location: "Green Zone"' }
          ]
        },
        {
          id: 2,
          name: "courses",
          collection: true,
          children: [
            { name: '_id: "ObjectId"' },
            { name: 'courseId: "CS101"' },
            { name: 'title: "Introduction to Data Science"' },
            { name: "level: 6" },
            { name: 'department: "department._id"' }
          ]
        },
        {
          id: 3,
          name: "offer",
          collection: true,
          children: [
            { name: 'course: "course._id"' },
            { name: "year: 2016" },
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
            { name: '_id: "15101010"' },
            { name: 'stuName: "Chan Tai Man"' },
            { name: 'dOB: "10/08/2009"' },
            {
              id: 41,
              name: "enrolled",
              children: [
                { name: 'courseID: "CS101"' },
                { name: 'enrolDate: "15/05/2016"' }
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
            { name: '_id: "ObjectId"' },
            { name: 'deptId: "CS"' },
            { name: 'deptName: "Computer Science"' },
            { name: 'location: "Green Zone"' },
            {
              id: 11,
              name: "courses",
              children: [{ name: "course._id" }, { name: "course._id" }]
            }
          ]
        },
        {
          id: 2,
          name: "courses",
          collection: true,
          children: [
            { name: '_id: "ObjectId"' },
            { name: 'courseId: "CS101"' },
            { name: 'title: "Introduction to Data Science"' },
            { name: "level: 6" }
          ]
        },
        {
          id: 3,
          name: "offer",
          collection: true,
          children: [
            { name: 'department: "department._id"' },
            { name: 'course: "course._id"' },
            { name: "year: 2016" },
            { name: "classSize: 40" },
            { name: "availablePlaces: 39" },
            { name: "enrolledCount: 1" },
            {
              id: 31,
              name: "enrolled",
              children: [
                { name: 'student: "15101010"' },
                { name: 'enrolDate: "15/05/2016"' }
              ]
            }
          ]
        },
        {
          id: 4,
          name: "students",
          collection: true,
          children: [
            { name: '_id: "15101010"' },
            { name: 'stuName: "Chan Tai Man"' },
            { name: 'dOB: "10/08/2009"' }
          ]
        }
      ]
    };
  }
};
</script>
